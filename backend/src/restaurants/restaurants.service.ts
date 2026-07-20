import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { RestaurantResponseDto } from './dto/restaurant-response.dto.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
import { BranchResponseDto } from './dto/branch-response.dto.js';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    const slug = dto.slug.trim().toLowerCase();

    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new BadRequestException(
        'Slug must contain only lowercase letters, numbers, and hyphens',
      );
    }

    const existing = await this.prisma.restaurant.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('A restaurant with this slug already exists');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
        },
      });

      const membership = await tx.restaurantMembership.create({
        data: {
          userId,
          restaurantId: restaurant.id,
          role: 'OWNER',
          status: 'ACTIVE',
        },
      });

      return { restaurant, membership };
    });

    return {
      id: result.restaurant.id,
      name: result.restaurant.name,
      slug: result.restaurant.slug,
      description: result.restaurant.description,
      status: result.restaurant.status,
      createdAt: result.restaurant.createdAt,
      userRole: result.membership.role,
    };
  }

  async listUserRestaurants(
    userId: string,
  ): Promise<RestaurantResponseDto[]> {
    const memberships = await this.prisma.restaurantMembership.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        restaurant: true,
      },
      orderBy: { restaurant: { createdAt: 'asc' } },
    });

    return memberships.map((m) => ({
      id: m.restaurant.id,
      name: m.restaurant.name,
      slug: m.restaurant.slug,
      description: m.restaurant.description,
      status: m.restaurant.status,
      createdAt: m.restaurant.createdAt,
      userRole: m.role,
    }));
  }

  async getOne(
    userId: string,
    restaurantId: string,
  ): Promise<RestaurantResponseDto> {
    const membership = await this.prisma.restaurantMembership.findUnique({
      where: {
        userId_restaurantId: { userId, restaurantId },
      },
      include: {
        restaurant: true,
      },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new NotFoundException();
    }

    return {
      id: membership.restaurant.id,
      name: membership.restaurant.name,
      slug: membership.restaurant.slug,
      description: membership.restaurant.description,
      status: membership.restaurant.status,
      createdAt: membership.restaurant.createdAt,
      userRole: membership.role,
    };
  }

  async createBranch(
    restaurantId: string,
    dto: CreateBranchDto,
  ): Promise<BranchResponseDto> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.status !== 'ACTIVE') {
      throw new NotFoundException();
    }

    const timezone = dto.timezone?.trim() ?? '';
    if (dto.timezone !== undefined && timezone.length === 0) {
      throw new BadRequestException('Timezone must be a non-empty string');
    }

    const finalTimezone = timezone.length > 0 ? timezone : 'Asia/Tehran';
    const currencyCode = dto.currencyCode?.trim().toUpperCase() ?? 'IRR';

    const branch = await this.prisma.branch.create({
      data: {
        restaurantId,
        name: dto.name,
        address: dto.address,
        timezone: finalTimezone,
        currencyCode,
      },
    });

    return {
      id: branch.id,
      restaurantId: branch.restaurantId,
      name: branch.name,
      address: branch.address,
      timezone: branch.timezone,
      currencyCode: branch.currencyCode,
      status: branch.status,
      publicMenuEnabled: branch.publicMenuEnabled,
      createdAt: branch.createdAt,
    };
  }

  async listBranches(restaurantId: string): Promise<BranchResponseDto[]> {
    const branches = await this.prisma.branch.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'asc' },
    });

    return branches.map((b) => ({
      id: b.id,
      restaurantId: b.restaurantId,
      name: b.name,
      address: b.address,
      timezone: b.timezone,
      currencyCode: b.currencyCode,
      status: b.status,
      publicMenuEnabled: b.publicMenuEnabled,
      createdAt: b.createdAt,
    }));
  }
}
