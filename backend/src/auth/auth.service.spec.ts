import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from './utils/password-hasher';
import { hashToken } from './utils/token-hasher';

function createMockPrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

function createMockJwtService() {
  return {
    signAsync: jest.fn().mockResolvedValue('mock-access-token'),
  };
}

function createMockConfigService() {
  return {
    get: jest.fn((key: string, defaultValue?: unknown) => {
      const config: Record<string, unknown> = {
        JWT_ACCESS_SECRET: 'test-secret-that-is-at-least-32-characters!',
        JWT_ACCESS_TTL: '15m',
        REFRESH_TOKEN_TTL_DAYS: 30,
      };
      return config[key] ?? defaultValue;
    }),
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof createMockPrisma>;
  let jwtService: ReturnType<typeof createMockJwtService>;
  let configService: ReturnType<typeof createMockConfigService>;

  beforeEach(async () => {
    prisma = createMockPrisma();
    jwtService = createMockJwtService();
    configService = createMockConfigService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date('2025-01-01'),
      });
      prisma.refreshSession.create.mockResolvedValue({});

      const result = await service.register(
        'test@example.com',
        'Password123!',
        'Test User',
      );

      expect(result.user.email).toBe('test@example.com');
      expect(result.user.fullName).toBe('Test User');
      expect(result.user.id).toBe('user-1');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.refreshSession.create).toHaveBeenCalledTimes(1);
    });

    it('should reject duplicate email with ConflictException', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'existing',
        email: 'test@example.com',
      });

      await expect(
        service.register('test@example.com', 'Password123!', 'Test User'),
      ).rejects.toThrow(ConflictException);
    });

    it('should normalize email to lowercase and trimmed', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      prisma.refreshSession.create.mockResolvedValue({});

      await service.register('  Test@Example.COM  ', 'Password123!', 'Test User');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: 'test@example.com' }),
        }),
      );
    });

    it('should hash the password, not store it raw', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      prisma.refreshSession.create.mockResolvedValue({});

      await service.register('test@example.com', 'Password123!', 'Test User');

      const createCall = prisma.user.create.mock.calls[0][0];
      const storedHash = createCall.data.passwordHash;
      expect(storedHash).not.toBe('Password123!');
      expect(storedHash).toContain(':');
      expect(storedHash.length).toBeGreaterThan(20);
    });

    it('should store refresh token hash, not the raw token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      prisma.refreshSession.create.mockResolvedValue({});

      const result = await service.register(
        'test@example.com',
        'Password123!',
        'Test User',
      );

      const createCall = prisma.refreshSession.create.mock.calls[0][0];
      const storedHash = createCall.data.tokenHash;
      const rawToken = result.tokens.refreshToken;

      expect(storedHash).not.toBe(rawToken);
      expect(storedHash).toBe(hashToken(rawToken));
      expect(storedHash.length).toBe(64);
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      fullName: 'Test User',
      status: 'ACTIVE',
      passwordHash: '',
      createdAt: new Date('2025-01-01'),
    };

    beforeEach(async () => {
      const { hash } = await hashPassword('Password123!');
      mockUser.passwordHash = hash;
    });

    it('should login successfully with valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser });
      prisma.refreshSession.create.mockResolvedValue({});

      const result = await service.login('test@example.com', 'Password123!');

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should return generic 401 for non-existent email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nobody@example.com', 'Password123!'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return generic 401 for wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser });

      await expect(
        service.login('test@example.com', 'WrongPassword!'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return generic 401 when user has no passwordHash (OAuth user)', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        passwordHash: null,
      });

      await expect(
        service.login('test@example.com', 'Password123!'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject suspended users with ForbiddenException', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        status: 'SUSPENDED',
      });

      await expect(
        service.login('test@example.com', 'Password123!'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should normalize email on login', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser });
      prisma.refreshSession.create.mockResolvedValue({});

      await service.login('  Test@Example.COM  ', 'Password123!');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('refresh', () => {
    it('should rotate tokens atomically', async () => {
      const session = {
        id: 'session-1',
        userId: 'user-1',
        tokenHash: hashToken('old-token'),
        revokedAt: null,
        expiresAt: new Date(Date.now() + 86400000),
      };

      const user = { id: 'user-1', email: 'test@example.com' };

      prisma.refreshSession.findUnique.mockResolvedValue(session);
      prisma.$transaction.mockImplementation(async (fn: unknown) => {
        const tx = {
          refreshSession: {
            update: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
          },
          user: {
            findUniqueOrThrow: jest.fn().mockResolvedValue(user),
          },
        };
        return (fn as (t: typeof tx) => Promise<unknown>)(tx);
      });

      const result = await service.refresh('old-token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should reject missing session with UnauthorizedException', async () => {
      prisma.refreshSession.findUnique.mockResolvedValue(null);

      await expect(service.refresh('nonexistent-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject expired session with UnauthorizedException', async () => {
      prisma.refreshSession.findUnique.mockResolvedValue({
        id: 'session-1',
        userId: 'user-1',
        tokenHash: hashToken('expired-token'),
        revokedAt: null,
        expiresAt: new Date('2020-01-01'),
      });

      await expect(service.refresh('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject revoked session with UnauthorizedException', async () => {
      prisma.refreshSession.findUnique.mockResolvedValue({
        id: 'session-1',
        userId: 'user-1',
        tokenHash: hashToken('revoked-token'),
        revokedAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000),
      });

      await expect(service.refresh('revoked-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should revoke session successfully', async () => {
      prisma.refreshSession.updateMany.mockResolvedValue({ count: 1 });

      await service.logout('some-token');

      expect(prisma.refreshSession.updateMany).toHaveBeenCalledWith({
        where: {
          tokenHash: hashToken('some-token'),
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date),
        },
      });
    });

    it('should be idempotent when token does not exist', async () => {
      prisma.refreshSession.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.logout('nonexistent-token'),
      ).resolves.toBeUndefined();

      expect(prisma.refreshSession.updateMany).toHaveBeenCalledTimes(1);
    });

    it('should not disclose whether the token existed', async () => {
      prisma.refreshSession.updateMany.mockResolvedValue({ count: 0 });

      const result = await service.logout('nonexistent-token');
      expect(result).toBeUndefined();
    });
  });

  describe('getMe', () => {
    it('should return sanitized user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date('2025-01-01'),
      });

      const result = await service.getMe('user-1');

      expect(result).toEqual({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date('2025-01-01'),
      });
    });

    it('should never return passwordHash', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        passwordHash: 'hashed-password',
        createdAt: new Date('2025-01-01'),
      });

      const result = await service.getMe('user-1');

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('avatarMediaId');
      expect(result).not.toHaveProperty('emailVerifiedAt');
    });

    it('should throw UnauthorizedException for nonexistent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('nonexistent-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw ForbiddenException for suspended user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'SUSPENDED',
        createdAt: new Date('2025-01-01'),
      });

      await expect(service.getMe('user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('access token creation', () => {
    it('should create JWT with sub and email claims', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      prisma.refreshSession.create.mockResolvedValue({});

      await service.register('test@example.com', 'Password123!', 'Test User');

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: 'user-1', email: 'test@example.com' },
        expect.objectContaining({
          secret: 'test-secret-that-is-at-least-32-characters!',
        }),
      );
    });

    it('should not include passwordHash or secrets in JWT', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        fullName: 'Test User',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      prisma.refreshSession.create.mockResolvedValue({});

      await service.register('test@example.com', 'Password123!', 'Test User');

      const payload = jwtService.signAsync.mock.calls[0][0];
      expect(payload).not.toHaveProperty('passwordHash');
      expect(payload).not.toHaveProperty('refreshToken');
      expect(Object.keys(payload)).toEqual(
        expect.arrayContaining(['sub', 'email']),
      );
      expect(Object.keys(payload)).toHaveLength(2);
    });
  });
});
