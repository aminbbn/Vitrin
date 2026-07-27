import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpsertBranchProductDto } from './dto/upsert-branch-product.dto.js';
import { UpdateBranchProductDto } from './dto/update-branch-product.dto.js';
import { BranchProductResponseDto } from './dto/branch-product-response.dto.js';
import { BranchCatalogProductResponseDto } from './dto/branch-catalog-product-response.dto.js';

@Injectable()
export class BranchProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async listCatalogProducts(
    restaurantId: string,
    branchId: string,
  ): Promise<BranchCatalogProductResponseDto[]> {
    await this.assertValidBranch(restaurantId, branchId);

    const products = await this.prisma.product.findMany({
      where: { restaurantId, archivedAt: null },
      include: {
        category: { select: { id: true, name: true, displayOrder: true } },
        branchProducts: {
          where: { branchId },
          select: {
            branchPrice: true,
            branchDiscountPrice: true,
            availability: true,
            isVisible: true,
          },
        },
      },
      orderBy: [
        { category: { displayOrder: 'asc' } },
        { createdAt: 'asc' },
      ],
    });

    return products.map((p) => {
      const bp = p.branchProducts[0];
      return {
        productId: p.id,
        name: p.name,
        displayName: p.displayName,
        description: p.description,
        categoryId: p.category.id,
        categoryName: p.category.name,
        isActive: p.isActive,
        productCreatedAt: p.createdAt,
        branchPrice: bp?.branchPrice ?? null,
        branchDiscountPrice: bp?.branchDiscountPrice ?? null,
        availability: bp?.availability ?? null,
        isVisible: bp?.isVisible ?? null,
        isConfigured: bp !== undefined,
      };
    });
  }

  async upsertBranchProduct(
    restaurantId: string,
    branchId: string,
    productId: string,
    dto: UpsertBranchProductDto,
  ): Promise<BranchProductResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);
    await this.assertValidProduct(restaurantId, productId);
    this.assertValidDiscountPrice(dto.branchPrice, dto.branchDiscountPrice);

    const branchProduct = await this.prisma.branchProduct.upsert({
      where: { branchId_productId: { branchId, productId } },
      create: {
        branchId,
        productId,
        branchPrice: dto.branchPrice,
        branchDiscountPrice: dto.branchDiscountPrice ?? null,
        availability: (dto.availability as 'AVAILABLE' | 'UNAVAILABLE') ?? 'AVAILABLE',
        isVisible: dto.isVisible ?? true,
      },
      update: {
        branchPrice: dto.branchPrice,
        branchDiscountPrice: dto.branchDiscountPrice ?? null,
        availability: (dto.availability as 'AVAILABLE' | 'UNAVAILABLE') ?? 'AVAILABLE',
        isVisible: dto.isVisible ?? true,
      },
    });

    return this.toBranchProductResponse(branchProduct);
  }

  async updateBranchProduct(
    restaurantId: string,
    branchId: string,
    productId: string,
    dto: UpdateBranchProductDto,
  ): Promise<BranchProductResponseDto> {
    await this.assertValidBranch(restaurantId, branchId);
    await this.assertValidProduct(restaurantId, productId);

    const existing = await this.prisma.branchProduct.findUnique({
      where: { branchId_productId: { branchId, productId } },
    });

    if (!existing) {
      throw new NotFoundException(
        'No branch product configuration exists. Use PUT to create one first.',
      );
    }

    const finalBranchPrice = dto.branchPrice ?? existing.branchPrice;
    const finalDiscountPrice =
      dto.branchDiscountPrice !== undefined
        ? dto.branchDiscountPrice
        : existing.branchDiscountPrice;

    this.assertValidDiscountPrice(finalBranchPrice, finalDiscountPrice ?? undefined);

    const updated = await this.prisma.branchProduct.update({
      where: { branchId_productId: { branchId, productId } },
      data: {
        ...(dto.branchPrice !== undefined && { branchPrice: dto.branchPrice }),
        ...(dto.branchDiscountPrice !== undefined && {
          branchDiscountPrice: dto.branchDiscountPrice,
        }),
        ...(dto.availability !== undefined && {
          availability: dto.availability as 'AVAILABLE' | 'UNAVAILABLE',
        }),
        ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
      },
    });

    return this.toBranchProductResponse(updated);
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

  private async assertValidProduct(
    restaurantId: string,
    productId: string,
  ): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, restaurantId: true, archivedAt: true },
    });

    if (!product || product.restaurantId !== restaurantId) {
      throw new NotFoundException();
    }

    if (product.archivedAt !== null) {
      throw new BadRequestException('Product is archived');
    }
  }

  private assertValidDiscountPrice(
    branchPrice: number,
    branchDiscountPrice: number | undefined | null,
  ): void {
    if (
      branchDiscountPrice !== undefined &&
      branchDiscountPrice !== null &&
      branchDiscountPrice >= branchPrice
    ) {
      throw new BadRequestException(
        'branchDiscountPrice must be lower than branchPrice',
      );
    }
  }

  private toBranchProductResponse(bp: {
    id: string;
    branchId: string;
    productId: string;
    branchPrice: number;
    branchDiscountPrice: number | null;
    availability: string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): BranchProductResponseDto {
    return {
      id: bp.id,
      branchId: bp.branchId,
      productId: bp.productId,
      branchPrice: bp.branchPrice,
      branchDiscountPrice: bp.branchDiscountPrice,
      availability: bp.availability,
      isVisible: bp.isVisible,
      createdAt: bp.createdAt,
      updatedAt: bp.updatedAt,
    };
  }
}
