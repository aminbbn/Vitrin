import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductResponseDto } from './dto/product-response.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    restaurantId: string,
    dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    await this.assertRestaurantExists(restaurantId);
    await this.assertCategoryOwned(restaurantId, dto.categoryId);

    const product = await this.prisma.product.create({
      data: {
        restaurantId,
        categoryId: dto.categoryId,
        name: dto.name,
        displayName: dto.name,
        description: dto.description,
      },
    });

    return this.toResponse(product);
  }

  async list(
    restaurantId: string,
    categoryId?: string,
  ): Promise<ProductResponseDto[]> {
    await this.assertRestaurantExists(restaurantId);

    const where: {
      restaurantId: string;
      archivedAt: null;
      categoryId?: string;
    } = { restaurantId, archivedAt: null };

    if (categoryId) {
      await this.assertCategoryOwned(restaurantId, categoryId);
      where.categoryId = categoryId;
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: [{ createdAt: 'asc' }],
    });

    return products.map((p) => this.toResponse(p));
  }

  async getOne(
    restaurantId: string,
    productId: string,
  ): Promise<ProductResponseDto> {
    const product = await this.findOwnedProduct(restaurantId, productId);
    return this.toResponse(product);
  }

  async update(
    restaurantId: string,
    productId: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.findOwnedProduct(restaurantId, productId);

    if (dto.categoryId) {
      await this.assertCategoryOwned(restaurantId, dto.categoryId);
    }

    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.name !== undefined && {
          name: dto.name,
          displayName: dto.name,
        }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });

    return this.toResponse(updated);
  }

  async remove(restaurantId: string, productId: string): Promise<void> {
    const product = await this.findOwnedProduct(restaurantId, productId);
    await this.prisma.product.delete({ where: { id: product.id } });
  }

  private async assertRestaurantExists(restaurantId: string): Promise<void> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true },
    });

    if (!restaurant) {
      throw new NotFoundException();
    }
  }

  private async assertCategoryOwned(
    restaurantId: string,
    categoryId: string,
  ): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, restaurantId: true },
    });

    if (!category || category.restaurantId !== restaurantId) {
      throw new NotFoundException();
    }
  }

  private async findOwnedProduct(
    restaurantId: string,
    productId: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.restaurantId !== restaurantId) {
      throw new NotFoundException();
    }

    return product;
  }

  private toResponse(
    product: {
      id: string;
      restaurantId: string;
      categoryId: string;
      name: string;
      displayName: string;
      description: string | null;
      isActive: boolean;
      createdAt: Date;
    },
  ): ProductResponseDto {
    return {
      id: product.id,
      restaurantId: product.restaurantId,
      categoryId: product.categoryId,
      name: product.name,
      displayName: product.displayName,
      description: product.description,
      isActive: product.isActive,
      createdAt: product.createdAt,
    };
  }
}
