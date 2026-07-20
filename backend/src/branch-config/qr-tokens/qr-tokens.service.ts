import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QrTokenResponseDto } from './dto/qr-token-response.dto.js';

@Injectable()
export class QrTokensService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveToken(
    restaurantId: string,
    branchId: string,
    tableId: string,
  ): Promise<QrTokenResponseDto> {
    await this.assertValidTable(restaurantId, branchId, tableId);

    const token = await this.prisma.tableQrToken.findFirst({
      where: { tableId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });

    if (!token) {
      throw new NotFoundException('No active QR token for this table. Generate one first.');
    }

    return this.toResponse(token);
  }

  async generateToken(
    restaurantId: string,
    branchId: string,
    tableId: string,
  ): Promise<QrTokenResponseDto> {
    await this.assertValidTable(restaurantId, branchId, tableId);

    return await this.prisma.$transaction(async (tx) => {
      // Revoke any existing active tokens for this table
      await tx.tableQrToken.updateMany({
        where: { tableId, status: 'ACTIVE' },
        data: { status: 'REVOKED', revokedAt: new Date() },
      });

      // Generate a new non-guessable token
      const tokenValue = randomBytes(32).toString('base64url');

      const token = await tx.tableQrToken.create({
        data: {
          tableId,
          token: tokenValue,
        },
      });

      return this.toResponse(token);
    });
  }

  async revokeToken(
    restaurantId: string,
    branchId: string,
    tableId: string,
  ): Promise<void> {
    await this.assertValidTable(restaurantId, branchId, tableId);

    const activeToken = await this.prisma.tableQrToken.findFirst({
      where: { tableId, status: 'ACTIVE' },
    });

    if (!activeToken) {
      throw new NotFoundException('No active QR token to revoke');
    }

    await this.prisma.tableQrToken.update({
      where: { id: activeToken.id },
      data: { status: 'REVOKED', revokedAt: new Date() },
    });
  }

  private async assertValidTable(
    restaurantId: string,
    branchId: string,
    tableId: string,
  ): Promise<void> {
    const table = await this.prisma.branchTable.findUnique({
      where: { id: tableId },
      select: { id: true, branchId: true },
    });

    if (!table || table.branchId !== branchId) {
      throw new NotFoundException();
    }

    // Verify branch ownership
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      select: { id: true, restaurantId: true, status: true },
    });

    if (!branch || branch.restaurantId !== restaurantId) {
      throw new NotFoundException();
    }

    if (branch.status !== 'ACTIVE') {
      throw new BadRequestException('Branch is not active');
    }
  }

  private toResponse(t: {
    id: string;
    tableId: string;
    token: string;
    status: string;
    revokedAt: Date | null;
    createdAt: Date;
  }): QrTokenResponseDto {
    return {
      id: t.id,
      tableId: t.tableId,
      token: t.token,
      status: t.status,
      revokedAt: t.revokedAt,
      createdAt: t.createdAt,
    };
  }
}
