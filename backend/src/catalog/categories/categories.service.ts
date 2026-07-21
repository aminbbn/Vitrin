import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CategoryResponseDto } from './dto/category-response.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    restaurantId: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    await this.assertRestaurantExists(restaurantId);

    const sortOrder = dto.sortOrder ?? (await this.nextDisplayOrder(restaurantId));

    try {
      const category = await this.prisma.category.create({
        data: {
          restaurantId,
          name: dto.name,
          displayOrder: sortOrder,
        },
      });

      return this.toResponse(category);
    } catch (error: unknown) {
      this.throwConflictOnUniqueViolation(error);
      throw error;
    }
  }

  async list(restaurantId: string): Promise<CategoryResponseDto[]> {
    await this.assertRestaurantExists(restaurantId);

    const categories = await this.prisma.category.findMany({
      where: { restaurantId, archivedAt: null },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return categories.map((c) => this.toResponse(c));
  }

  async update(
    restaurantId: string,
    categoryId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.findOwnedCategory(restaurantId, categoryId);

    try {
      const updated = await this.prisma.category.update({
        where: { id: category.id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.sortOrder !== undefined && { displayOrder: dto.sortOrder }),
        },
      });

      return this.toResponse(updated);
    } catch (error: unknown) {
      this.throwConflictOnUniqueViolation(error);
      throw error;
    }
  }

  async remove(restaurantId: string, categoryId: string): Promise<void> {
    const category = await this.findOwnedCategory(restaurantId, categoryId);

    const productCount = await this.prisma.product.count({
      where: { categoryId: category.id, archivedAt: null },
    });

    if (productCount > 0) {
      throw new ConflictException(
        'Cannot delete category that still has products',
      );
    }

    await this.prisma.category.delete({ where: { id: category.id } });
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

  private async findOwnedCategory(
    restaurantId: string,
    categoryId: string,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.restaurantId !== restaurantId) {
      throw new NotFoundException();
    }

    return category;
  }

  private async nextDisplayOrder(restaurantId: string): Promise<number> {
    const last = await this.prisma.category.findFirst({
      where: { restaurantId },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    return (last?.displayOrder ?? -1) + 1;
  }

  private throwConflictOnUniqueViolation(error: unknown): void {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      throw new ConflictException('A category with this sort order already exists');
    }
  }

  private toResponse(
    category: {
      id: string;
      restaurantId: string;
      name: string;
      displayOrder: number;
      isActive: boolean;
      createdAt: Date;
    },
  ): CategoryResponseDto {
    return {
      id: category.id,
      restaurantId: category.restaurantId,
      name: category.name,
      displayOrder: category.displayOrder,
      isActive: category.isActive,
      createdAt: category.createdAt,
    };
  }
}
