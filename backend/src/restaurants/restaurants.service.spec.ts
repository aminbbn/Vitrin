import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { PrismaService } from '../prisma/prisma.service';

function createMockPrisma() {
  return {
    restaurant: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    restaurantMembership: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    branch: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  describe('create', () => {
    const dto = { name: 'My Restaurant', slug: 'my-restaurant' };

    it('should create a restaurant and owner membership atomically', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(async (fn: unknown) => {
        const tx = {
          restaurant: {
            create: jest.fn().mockResolvedValue({
              id: 'rest-1',
              name: 'My Restaurant',
              slug: 'my-restaurant',
              description: null,
              status: 'ACTIVE',
              createdAt: new Date('2025-01-01'),
            }),
          },
          restaurantMembership: {
            create: jest.fn().mockResolvedValue({
              id: 'mem-1',
              role: 'OWNER',
              status: 'ACTIVE',
            }),
          },
        };
        return (fn as (t: typeof tx) => Promise<unknown>)(tx);
      });

      const result = await service.create('user-1', dto);

      expect(result.id).toBe('rest-1');
      expect(result.name).toBe('My Restaurant');
      expect(result.slug).toBe('my-restaurant');
      expect(result.userRole).toBe('OWNER');
      expect(result.status).toBe('ACTIVE');
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should normalize slug with trim and lowercase', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);
      const restaurantCreate = jest.fn().mockResolvedValue({
        id: 'rest-1',
        name: 'My Restaurant',
        slug: 'my-restaurant',
        description: null,
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      const membershipCreate = jest.fn().mockResolvedValue({
        id: 'mem-1',
        role: 'OWNER',
        status: 'ACTIVE',
      });
      prisma.$transaction.mockImplementation(async (fn: unknown) => {
        return (fn as (t: unknown) => Promise<unknown>)({
          restaurant: { create: restaurantCreate },
          restaurantMembership: { create: membershipCreate },
        });
      });

      await service.create('user-1', {
        name: 'My Restaurant',
        slug: '  My-Restaurant  ',
      });

      expect(restaurantCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'my-restaurant' }),
        }),
      );
    });

    it('should reject duplicate slug with ConflictException', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({
        id: 'existing',
        slug: 'my-restaurant',
      });

      await expect(
        service.create('user-1', dto),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject invalid slug format', async () => {
      await expect(
        service.create('user-1', { name: 'Test', slug: 'My_Restaurant!' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should include description when provided', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(async (fn: unknown) => {
        const tx = {
          restaurant: {
            create: jest.fn().mockResolvedValue({
              id: 'rest-1',
              name: 'My Restaurant',
              slug: 'my-restaurant',
              description: 'A great place',
              status: 'ACTIVE',
              createdAt: new Date(),
            }),
          },
          restaurantMembership: {
            create: jest.fn().mockResolvedValue({
              id: 'mem-1',
              role: 'OWNER',
              status: 'ACTIVE',
            }),
          },
        };
        return (fn as (t: typeof tx) => Promise<unknown>)(tx);
      });

      const result = await service.create('user-1', {
        name: 'My Restaurant',
        slug: 'my-restaurant',
        description: 'A great place',
      });

      expect(result.description).toBe('A great place');
    });
  });

  describe('listUserRestaurants', () => {
    it('should return only active memberships', async () => {
      prisma.restaurantMembership.findMany.mockResolvedValue([
        {
          id: 'mem-1',
          role: 'OWNER',
          status: 'ACTIVE',
          restaurant: {
            id: 'rest-1',
            name: 'Restaurant 1',
            slug: 'rest-1',
            description: null,
            status: 'ACTIVE',
            createdAt: new Date('2025-01-01'),
          },
        },
        {
          id: 'mem-2',
          role: 'MANAGER',
          status: 'ACTIVE',
          restaurant: {
            id: 'rest-2',
            name: 'Restaurant 2',
            slug: 'rest-2',
            description: null,
            status: 'ACTIVE',
            createdAt: new Date('2025-01-02'),
          },
        },
      ]);

      const result = await service.listUserRestaurants('user-1');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('rest-1');
      expect(result[0].userRole).toBe('OWNER');
      expect(result[1].id).toBe('rest-2');
      expect(result[1].userRole).toBe('MANAGER');

      expect(prisma.restaurantMembership.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: 'ACTIVE' },
        include: { restaurant: true },
        orderBy: { restaurant: { createdAt: 'asc' } },
      });
    });

    it('should return empty array for user with no memberships', async () => {
      prisma.restaurantMembership.findMany.mockResolvedValue([]);

      const result = await service.listUserRestaurants('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should return restaurant with user role', async () => {
      prisma.restaurantMembership.findUnique.mockResolvedValue({
        id: 'mem-1',
        role: 'OWNER',
        status: 'ACTIVE',
        restaurant: {
          id: 'rest-1',
          name: 'My Restaurant',
          slug: 'my-restaurant',
          description: null,
          status: 'ACTIVE',
          createdAt: new Date('2025-01-01'),
        },
      });

      const result = await service.getOne('user-1', 'rest-1');

      expect(result.id).toBe('rest-1');
      expect(result.userRole).toBe('OWNER');
    });

    it('should throw NotFoundException for inaccessible restaurant', async () => {
      prisma.restaurantMembership.findUnique.mockResolvedValue(null);

      await expect(
        service.getOne('user-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for suspended membership', async () => {
      prisma.restaurantMembership.findUnique.mockResolvedValue({
        id: 'mem-1',
        role: 'OWNER',
        status: 'SUSPENDED',
        restaurant: {
          id: 'rest-1',
          name: 'My Restaurant',
          slug: 'my-restaurant',
          description: null,
          status: 'ACTIVE',
          createdAt: new Date(),
        },
      });

      await expect(
        service.getOne('user-1', 'rest-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for removed membership', async () => {
      prisma.restaurantMembership.findUnique.mockResolvedValue({
        id: 'mem-1',
        role: 'OWNER',
        status: 'REMOVED',
        restaurant: {
          id: 'rest-1',
          name: 'My Restaurant',
          slug: 'my-restaurant',
          description: null,
          status: 'ACTIVE',
          createdAt: new Date(),
        },
      });

      await expect(
        service.getOne('user-1', 'rest-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBranch', () => {
    const baseRestaurant = {
      id: 'rest-1',
      name: 'My Restaurant',
      slug: 'my-restaurant',
      status: 'ACTIVE',
    };

    const createdBranch = {
      id: 'branch-1',
      restaurantId: 'rest-1',
      name: 'Main Branch',
      address: null,
      timezone: 'Asia/Tehran',
      currencyCode: 'IRR',
      status: 'ACTIVE',
      publicMenuEnabled: true,
      createdAt: new Date('2025-01-01'),
    };

    it('should create a branch with defaults', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(baseRestaurant);
      prisma.branch.create.mockResolvedValue(createdBranch);

      const result = await service.createBranch('rest-1', {
        name: 'Main Branch',
      });

      expect(result.timezone).toBe('Asia/Tehran');
      expect(result.currencyCode).toBe('IRR');
      expect(result.name).toBe('Main Branch');
      expect(result.restaurantId).toBe('rest-1');
    });

    it('should normalize currencyCode to uppercase', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(baseRestaurant);
      prisma.branch.create.mockResolvedValue({
        ...createdBranch,
        currencyCode: 'USD',
      });

      await service.createBranch('rest-1', {
        name: 'Main Branch',
        currencyCode: ' usd ',
      });

      expect(prisma.branch.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ currencyCode: 'USD' }),
        }),
      );
    });

    it('should use custom timezone when provided', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(baseRestaurant);
      prisma.branch.create.mockResolvedValue({
        ...createdBranch,
        timezone: 'Europe/London',
      });

      await service.createBranch('rest-1', {
        name: 'Main Branch',
        timezone: 'Europe/London',
      });

      expect(prisma.branch.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ timezone: 'Europe/London' }),
        }),
      );
    });

    it('should reject empty timezone string', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(baseRestaurant);

      await expect(
        service.createBranch('rest-1', { name: 'Branch', timezone: '   ' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for inactive restaurant', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({
        ...baseRestaurant,
        status: 'SUSPENDED',
      });

      await expect(
        service.createBranch('rest-1', { name: 'Branch' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent restaurant', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        service.createBranch('nonexistent', { name: 'Branch' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listBranches', () => {
    it('should return branches scoped to the restaurant', async () => {
      prisma.branch.findMany.mockResolvedValue([
        {
          id: 'branch-1',
          restaurantId: 'rest-1',
          name: 'Branch 1',
          address: null,
          timezone: 'Asia/Tehran',
          currencyCode: 'IRR',
          status: 'ACTIVE',
          publicMenuEnabled: true,
          createdAt: new Date('2025-01-01'),
        },
        {
          id: 'branch-2',
          restaurantId: 'rest-1',
          name: 'Branch 2',
          address: '123 Main St',
          timezone: 'Asia/Tehran',
          currencyCode: 'IRR',
          status: 'ACTIVE',
          publicMenuEnabled: true,
          createdAt: new Date('2025-01-02'),
        },
      ]);

      const result = await service.listBranches('rest-1');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('branch-1');
      expect(result[1].id).toBe('branch-2');

      expect(prisma.branch.findMany).toHaveBeenCalledWith({
        where: { restaurantId: 'rest-1' },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('should return empty array for restaurant with no branches', async () => {
      prisma.branch.findMany.mockResolvedValue([]);

      const result = await service.listBranches('rest-1');

      expect(result).toEqual([]);
    });
  });

  describe('sanitized responses', () => {
    it('should not expose membership internals in create response', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockImplementation(async (fn: unknown) => {
        const tx = {
          restaurant: {
            create: jest.fn().mockResolvedValue({
              id: 'rest-1',
              name: 'My Restaurant',
              slug: 'my-restaurant',
              description: null,
              status: 'ACTIVE',
              createdAt: new Date('2025-01-01'),
            }),
          },
          restaurantMembership: {
            create: jest.fn().mockResolvedValue({
              id: 'mem-1',
              userId: 'user-1',
              restaurantId: 'rest-1',
              role: 'OWNER',
              status: 'ACTIVE',
            }),
          },
        };
        return (fn as (t: typeof tx) => Promise<unknown>)(tx);
      });

      const result = await service.create('user-1', {
        name: 'My Restaurant',
        slug: 'my-restaurant',
      });

      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('restaurantId');
      expect(result).not.toHaveProperty('logoMediaId');
      expect(result).not.toHaveProperty('updatedAt');
    });

    it('should not expose unrelated fields in branch response', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({
        id: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.branch.create.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        name: 'Main',
        address: null,
        timezone: 'Asia/Tehran',
        currencyCode: 'IRR',
        status: 'ACTIVE',
        publicMenuEnabled: true,
        createdAt: new Date(),
        latitude: null,
        longitude: null,
        activeMenuPublicationId: null,
        updatedAt: new Date(),
      });

      const result = await service.createBranch('rest-1', { name: 'Main' });

      expect(result).not.toHaveProperty('latitude');
      expect(result).not.toHaveProperty('longitude');
      expect(result).not.toHaveProperty('activeMenuPublicationId');
      expect(result).not.toHaveProperty('updatedAt');
    });
  });
});
