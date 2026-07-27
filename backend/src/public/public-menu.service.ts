import {
  Injectable,
  NotFoundException,
  GoneException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PublicMenuResponseDto } from './dto/public-menu-response.dto.js';
import { QrResolutionResponseDto } from './dto/qr-resolution-response.dto.js';

@Injectable()
export class PublicMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveQrToken(token: string): Promise<QrResolutionResponseDto> {
    // Find the QR token
    const qrToken = await this.prisma.tableQrToken.findUnique({
      where: { token },
      include: {
        table: {
          include: {
            branch: {
              include: {
                restaurant: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!qrToken || qrToken.status !== 'ACTIVE') {
      throw new NotFoundException('Invalid or revoked QR token');
    }

    const table = qrToken.table;
    const branch = table.branch;

    if (branch.status !== 'ACTIVE') {
      throw new GoneException('This branch is currently unavailable');
    }

    if (!branch.publicMenuEnabled) {
      throw new GoneException('Public menu is disabled for this branch');
    }

    const menu = await this.getPublishedMenu(branch.id, branch.restaurant.name);

    if (!menu) {
      throw new NotFoundException('No published menu available for this branch');
    }

    return {
      tableId: table.id,
      tableNumber: table.tableNumber,
      branchId: branch.id,
      branchName: branch.name,
      restaurantName: branch.restaurant.name,
      menu: {
        ...menu,
        tableNumber: table.tableNumber,
      },
    };
  }

  async getPublicMenu(branchId: string): Promise<PublicMenuResponseDto> {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        restaurant: { select: { name: true } },
      },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    if (branch.status !== 'ACTIVE') {
      throw new GoneException('This branch is currently unavailable');
    }

    if (!branch.publicMenuEnabled) {
      throw new GoneException('Public menu is disabled for this branch');
    }

    const menu = await this.getPublishedMenu(branchId, branch.restaurant.name);

    if (!menu) {
      throw new NotFoundException('No published menu available for this branch');
    }

    return menu;
  }

  private async getPublishedMenu(
    branchId: string,
    restaurantName: string,
  ): Promise<PublicMenuResponseDto | null> {
    const publication = await this.prisma.menuPublication.findFirst({
      where: { branchId },
      orderBy: { version: 'desc' },
    });

    if (!publication) {
      return null;
    }

    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      select: { name: true, timezone: true, currencyCode: true },
    });

    const snapshot = publication.snapshot as Record<string, unknown>;

    return {
      branchId,
      branchName: branch?.name ?? '',
      restaurantName,
      tableNumber: null,
      timezone: branch?.timezone ?? 'Asia/Tehran',
      currencyCode: branch?.currencyCode ?? 'IRR',
      publicationVersion: publication.version,
      publishedAt: publication.createdAt,
      menu: snapshot,
    };
  }
}
