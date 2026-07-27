import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from './utils/password-hasher';
import { generateRefreshToken, hashToken } from './utils/token-hasher';
import { parseDuration } from './utils/parse-duration';
import { AuthenticatedUser } from './types/authenticated-user.type';
import { UserStatus } from '../generated/prisma/enums';

interface JwtPayload {
  sub: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private getRefreshTokenTtlDays(): number {
    const value = this.configService.get<number>('REFRESH_TOKEN_TTL_DAYS', 30);
    if (!value || value <= 0) {
      throw new InternalServerErrorException(
        'REFRESH_TOKEN_TTL_DAYS must be a positive number',
      );
    }
    return value;
  }

  private sanitizeUser(user: {
    id: string;
    email: string;
    fullName: string;
    status: UserStatus;
    createdAt: Date;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  private async issueTokenPair(
    userId: string,
    email: string,
  ): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, email };

    const ttlString = this.configService.get<string>('JWT_ACCESS_TTL', '15m');
    const ttlMs = parseDuration(ttlString);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: ttlMs,
    });

    const rawRefreshToken = generateRefreshToken();
    const tokenHash = hashToken(rawRefreshToken);
    const ttlDays = this.getRefreshTokenTtlDays();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ttlDays);

    await this.prisma.refreshSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  async register(email: string, password: string, fullName: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const { hash: passwordHash } = await hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName,
      },
    });

    const tokens = await this.issueTokenPair(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED') {
      throw new ForbiddenException('Account has been suspended');
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokenPair(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const tokenHash = hashToken(refreshToken);

    const session = await this.prisma.refreshSession.findUnique({
      where: { tokenHash },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException();
    }

    const newTokens = await this.prisma.$transaction(async (tx: any) => {
      await tx.refreshSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      });

      const payload: JwtPayload = { sub: session.userId, email: '' };

      const user = await tx.user.findUniqueOrThrow({
        where: { id: session.userId },
        select: { email: true },
      });
      payload.email = user.email;

      const ttlString = this.configService.get<string>('JWT_ACCESS_TTL', '15m');
      const ttlMs = parseDuration(ttlString);

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: ttlMs,
      });

      const rawRefreshToken = generateRefreshToken();
      const newTokenHash = hashToken(rawRefreshToken);
      const ttlDays = this.getRefreshTokenTtlDays();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + ttlDays);

      await tx.refreshSession.create({
        data: {
          userId: session.userId,
          tokenHash: newTokenHash,
          expiresAt,
        },
      });

      return { accessToken, refreshToken: rawRefreshToken };
    });

    return newTokens;
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);

    await this.prisma.refreshSession.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async getMe(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.status === 'SUSPENDED') {
      throw new ForbiddenException('Account has been suspended');
    }

    return this.sanitizeUser(user);
  }

  async googleLogin(idToken: string): Promise<{ user: AuthenticatedUser; tokens: TokenPair }> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID', '');
    if (!clientId) {
      throw new InternalServerErrorException('Google login is not configured');
    }

    // Verify the ID token via Google's tokeninfo endpoint
    const googleUser = await this.verifyGoogleToken(idToken, clientId);

    const normalizedEmail = googleUser.email.trim().toLowerCase();

    // Find existing user by email
    let user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Create new user (no password hash for Google-only accounts)
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          fullName: googleUser.name,
          emailVerifiedAt: new Date(),
        },
      });
    }

    // Link Google AuthAccount if not already linked
    const existingAccount = await this.prisma.authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'GOOGLE',
          providerAccountId: googleUser.sub,
        },
      },
    });

    if (!existingAccount) {
      await this.prisma.authAccount.create({
        data: {
          userId: user.id,
          provider: 'GOOGLE',
          providerAccountId: googleUser.sub,
          providerEmail: googleUser.email,
        },
      });
    }

    // Issue token pair
    const tokens = await this.issueTokenPair(user.id, user.email);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  private async verifyGoogleToken(
    idToken: string,
    expectedClientId: string,
  ): Promise<{ sub: string; email: string; name: string }> {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
      );

      if (!response.ok) {
        throw new Error('Invalid Google token');
      }

      const payload = await response.json() as {
        sub: string;
        email: string;
        name?: string;
        aud: string;
        exp: string;
      };

      // Validate audience matches our client ID
      if (payload.aud !== expectedClientId) {
        throw new Error('Token audience mismatch');
      }

      // Validate expiry
      const expiresAt = parseInt(payload.exp, 10) * 1000;
      if (Date.now() >= expiresAt) {
        throw new Error('Token expired');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid Google authentication token');
    }
  }
}
