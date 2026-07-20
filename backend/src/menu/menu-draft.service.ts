import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpsertMenuDraftDto } from './draft/dto/upsert-menu-draft.dto.js';
import { MenuDraftResponseDto } from './dto/menu-draft-response.dto.js';

@Injectable()
export class MenuDraftService {
  constructor(private readonly prisma: PrismaService) {}

  async getDraft(
    restaurantId: string,
    branchId: string,
  ): Promise<MenuDraftResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);

    const draft = await this.prisma.menuDraft.findUnique({
      where: { branchId },
    });

    if (!draft) {
      throw new NotFoundException(
        'No draft exists for this branch. Create one with PUT.',
      );
    }

    return this.toResponse(draft);
  }

  async upsertDraft(
    restaurantId: string,
    branchId: string,
    dto: UpsertMenuDraftDto,
  ): Promise<MenuDraftResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);

    const existing = await this.prisma.menuDraft.findUnique({
      where: { branchId },
    });

    if (existing) {
      const data: Prisma.MenuDraftUpdateInput = {};
      if (dto.layout !== undefined) data.layout = dto.layout as Prisma.InputJsonValue;
      if (dto.theme !== undefined) data.theme = dto.theme as Prisma.InputJsonValue;
      if (dto.categoryConfig !== undefined) data.categoryConfig = dto.categoryConfig as Prisma.InputJsonValue;
      if (dto.productConfig !== undefined) data.productConfig = dto.productConfig as Prisma.InputJsonValue;
      if (dto.displaySettings !== undefined) data.displaySettings = dto.displaySettings as Prisma.InputJsonValue;

      const updated = await this.prisma.menuDraft.update({
        where: { branchId },
        data,
      });

      return this.toResponse(updated);
    }

    const created = await this.prisma.menuDraft.create({
      data: {
        branchId,
        layout: (dto.layout ?? {}) as Prisma.InputJsonValue,
        theme: (dto.theme ?? {}) as Prisma.InputJsonValue,
        categoryConfig: (dto.categoryConfig ?? {}) as Prisma.InputJsonValue,
        productConfig: (dto.productConfig ?? {}) as Prisma.InputJsonValue,
        displaySettings: (dto.displaySettings ?? {}) as Prisma.InputJsonValue,
      },
    });

    return this.toResponse(created);
  }

  private async assertValidBranch(
    restaurantId: string,
    branchId: string,
  ): Promise<void> {
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

  private toResponse(d: {
    id: string;
    branchId: string;
    layout: unknown;
    theme: unknown;
    categoryConfig: unknown;
    productConfig: unknown;
    displaySettings: unknown;
    lastPublishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): MenuDraftResponseDto {
    return {
      id: d.id,
      branchId: d.branchId,
      layout: d.layout as Record<string, unknown>,
      theme: d.theme as Record<string, unknown>,
      categoryConfig: d.categoryConfig as Record<string, unknown>,
      productConfig: d.productConfig as Record<string, unknown>,
      displaySettings: d.displaySettings as Record<string, unknown>,
      lastPublishedAt: d.lastPublishedAt,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  }
}
