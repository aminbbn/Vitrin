import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PublicationResponseDto } from './dto/publication-response.dto.js';

@Injectable()
export class MenuPublicationService {
  constructor(private readonly prisma: PrismaService) {}

  async publish(
    restaurantId: string,
    branchId: string,
    userId: string,
  ): Promise<PublicationResponseDto> {
    const branch = await this.assertValidBranch(restaurantId, branchId);
    await this.assertPublishPermission(restaurantId, userId);

    // Get the draft
    const draft = await this.prisma.menuDraft.findUnique({
      where: { branchId },
    });

    if (!draft) {
      throw new BadRequestException(
        'No draft exists for this branch. Create a draft before publishing.',
      );
    }

    // Build snapshot from current state
    const snapshot = await this.buildSnapshot(branchId);

    // Get next version number
    const lastPublication = await this.prisma.menuPublication.findFirst({
      where: { branchId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    const nextVersion = (lastPublication?.version ?? 0) + 1;

    // Create publication and update branch atomically
    const publication = await this.prisma.$transaction(async (tx: any) => {
      const pub = await tx.menuPublication.create({
        data: {
          branchId,
          version: nextVersion,
          schemaVersion: 1,
          snapshot: snapshot as never,
          publishedByUserId: userId,
        },
      });

      await tx.branch.update({
        where: { id: branchId },
        data: { activeMenuPublicationId: pub.id },
      });

      // Update draft's lastPublishedAt
      await tx.menuDraft.update({
        where: { branchId },
        data: { lastPublishedAt: new Date() },
      });

      return pub;
    });

    return this.toResponse(publication);
  }

  async listPublications(
    restaurantId: string,
    branchId: string,
  ): Promise<PublicationResponseDto[]> {
    await this.assertValidBranch(restaurantId, branchId);

    const publications = await this.prisma.menuPublication.findMany({
      where: { branchId },
      orderBy: { version: 'desc' },
    });

    return publications.map((p) => this.toResponse(p));
  }

  async getPublication(
    restaurantId: string,
    branchId: string,
    publicationId: string,
  ): Promise<PublicationResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);

    const publication = await this.prisma.menuPublication.findFirst({
      where: { id: publicationId, branchId },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    return this.toResponse(publication);
  }

  async rollback(
    restaurantId: string,
    branchId: string,
    targetPublicationId: string,
    userId: string,
  ): Promise<PublicationResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);
    await this.assertPublishPermission(restaurantId, userId);

    // Find the target publication
    const target = await this.prisma.menuPublication.findFirst({
      where: { id: targetPublicationId, branchId },
    });

    if (!target) {
      throw new NotFoundException('Target publication not found');
    }

    // Get next version number
    const lastPublication = await this.prisma.menuPublication.findFirst({
      where: { branchId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    const nextVersion = (lastPublication?.version ?? 0) + 1;

    // Create new publication with copied snapshot and update branch atomically
    const publication = await this.prisma.$transaction(async (tx: any) => {
      const pub = await tx.menuPublication.create({
        data: {
          branchId,
          version: nextVersion,
          schemaVersion: target.schemaVersion,
          snapshot: target.snapshot as never,
          publishedByUserId: userId,
        },
      });

      await tx.branch.update({
        where: { id: branchId },
        data: { activeMenuPublicationId: pub.id },
      });

      return pub;
    });

    return this.toResponse(publication);
  }

  private async buildSnapshot(branchId: string): Promise<Record<string, unknown>> {
    // Get the draft
    const draft = await this.prisma.menuDraft.findUnique({
      where: { branchId },
    });

    // Get branch products with product info
    const branchProducts = await this.prisma.branchProduct.findMany({
      where: { branchId, isVisible: true },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, displayOrder: true } },
            modifierGroups: {
              include: {
                modifierGroup: {
                  include: {
                    options: {
                      where: { isActive: true },
                      orderBy: { displayOrder: 'asc' },
                    },
                  },
                },
              },
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    // Get branch info
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
      select: { name: true, timezone: true, currencyCode: true },
    });

    // Build snapshot
    return {
      branch: {
        name: branch?.name,
        timezone: branch?.timezone,
        currencyCode: branch?.currencyCode,
      },
      draft: {
        layout: draft?.layout,
        theme: draft?.theme,
        displaySettings: draft?.displaySettings,
      },
      categories: this.buildCategoriesSnapshot(branchProducts),
      publishedAt: new Date().toISOString(),
    };
  }

  private buildCategoriesSnapshot(
    branchProducts: Array<{
      product: {
        id: string;
        name: string;
        displayName: string;
        description: string | null;
        imageMediaId: string | null;
        category: { id: string; name: string; displayOrder: number };
        modifierGroups: Array<{
          modifierGroup: {
            id: string;
            name: string;
            isRequired: boolean;
            minSelections: number;
            maxSelections: number | null;
            options: Array<{
              id: string;
              name: string;
              priceAdjustment: number;
            }>;
          };
        }>;
      };
      branchPrice: number;
      branchDiscountPrice: number | null;
      availability: string;
    }>,
  ): Array<Record<string, unknown>> {
    const categoryMap = new Map<
      string,
      {
        id: string;
        name: string;
        displayOrder: number;
        products: Array<Record<string, unknown>>;
      }
    >();

    for (const bp of branchProducts) {
      const cat = bp.product.category;
      if (!categoryMap.has(cat.id)) {
        categoryMap.set(cat.id, {
          id: cat.id,
          name: cat.name,
          displayOrder: cat.displayOrder,
          products: [],
        });
      }

      const category = categoryMap.get(cat.id)!;
      category.products.push({
        id: bp.product.id,
        name: bp.product.name,
        displayName: bp.product.displayName,
        description: bp.product.description,
        imageMediaId: bp.product.imageMediaId,
        branchPrice: bp.branchPrice,
        branchDiscountPrice: bp.branchDiscountPrice,
        availability: bp.availability,
        modifierGroups: bp.product.modifierGroups.map((mg) => ({
          id: mg.modifierGroup.id,
          name: mg.modifierGroup.name,
          isRequired: mg.modifierGroup.isRequired,
          minSelections: mg.modifierGroup.minSelections,
          maxSelections: mg.modifierGroup.maxSelections,
          options: mg.modifierGroup.options.map((o) => ({
            id: o.id,
            name: o.name,
            priceAdjustment: o.priceAdjustment,
          })),
        })),
      });
    }

    return Array.from(categoryMap.values()).sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
  }

  private async assertValidBranch(
    restaurantId: string,
    branchId: string,
  ): Promise<{ id: string; restaurantId: string; status: string }> {
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

    return branch;
  }

  private async assertPublishPermission(
    restaurantId: string,
    userId: string,
  ): Promise<void> {
    const membership = await this.prisma.restaurantMembership.findUnique({
      where: { userId_restaurantId: { userId, restaurantId } },
      select: { id: true, role: true, status: true },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new ForbiddenException('Not a member of this restaurant');
    }

    // OWNER always has publish permission
    if (membership.role === 'OWNER') {
      return;
    }

    // MANAGER needs explicit permission
    const permission = await this.prisma.membershipPermission.findUnique({
      where: {
        membershipId_permission: {
          membershipId: membership.id,
          permission: 'MENU_PUBLISH',
        },
      },
    });

    if (!permission) {
      throw new ForbiddenException(
        'MANAGER requires explicit MENU_PUBLISH permission from OWNER',
      );
    }
  }

  private toResponse(p: {
    id: string;
    branchId: string;
    version: number;
    schemaVersion: number;
    snapshot: unknown;
    publishedByUserId: string;
    createdAt: Date;
  }): PublicationResponseDto {
    return {
      id: p.id,
      branchId: p.branchId,
      version: p.version,
      schemaVersion: p.schemaVersion,
      snapshot: p.snapshot as Record<string, unknown>,
      publishedByUserId: p.publishedByUserId,
      createdAt: p.createdAt,
    };
  }
}
