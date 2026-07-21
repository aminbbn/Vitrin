import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../../prisma/prisma.service';

function createMockPrisma() {
  return {
    restaurant: {
      findUnique: jest.fn(),
    },
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    product: {
      count: jest.fn(),
    },
  };
}

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();
    prisma.restaurant.findUnique.mockResolvedValue({ id: 'rest-1' });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should create a category with provided sortOrder', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Main Courses',
        displayOrder: 1,
        isActive: true,
        archivedAt: null,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      });

      const result = await service.create('rest-1', {
        name: 'Main Courses',
        sortOrder: 1,
      });

      expect(result.id).toBe('cat-1');
      expect(result.name).toBe('Main Courses');
      expect(result.displayOrder).toBe(1);
      expect(result.restaurantId).toBe('rest-1');
    });

    it('should auto-assign sortOrder when not provided', async () => {
      prisma.category.findFirst.mockResolvedValue({
        displayOrder: 5,
      });
      prisma.category.create.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Desserts',
        displayOrder: 6,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create('rest-1', { name: 'Desserts' });

      expect(result.displayOrder).toBe(6);
    });

    it('should start at 0 when no categories exist', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'First',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create('rest-1', { name: 'First' });

      expect(result.displayOrder).toBe(0);
    });

    it('should throw NotFoundException for nonexistent restaurant', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        service.create('nonexistent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException on unique constraint violation', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.create('rest-1', { name: 'Test', sortOrder: 0 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('list', () => {
    it('should return categories ordered by displayOrder then createdAt', async () => {
      prisma.category.findMany.mockResolvedValue([
        {
          id: 'cat-1',
          restaurantId: 'rest-1',
          name: 'A',
          displayOrder: 0,
          isActive: true,
          archivedAt: null,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date(),
        },
        {
          id: 'cat-2',
          restaurantId: 'rest-1',
          name: 'B',
          displayOrder: 1,
          isActive: true,
          archivedAt: null,
          createdAt: new Date('2025-01-02'),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.list('rest-1');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('A');
      expect(result[1].name).toBe('B');
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { restaurantId: 'rest-1', archivedAt: null },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'asc' }],
      });
    });

    it('should return empty array for restaurant with no categories', async () => {
      prisma.category.findMany.mockResolvedValue([]);

      const result = await service.list('rest-1');

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException for nonexistent restaurant', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);

      await expect(service.list('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update category name', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Old Name',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.category.update.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'New Name',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update('rest-1', 'cat-1', {
        name: 'New Name',
      });

      expect(result.name).toBe('New Name');
    });

    it('should update category sortOrder', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Test',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.category.update.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Test',
        displayOrder: 5,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update('rest-1', 'cat-1', {
        sortOrder: 5,
      });

      expect(result.displayOrder).toBe(5);
    });

    it('should reject cross-restaurant category access', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-OTHER',
        name: 'Test',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.update('rest-1', 'cat-1', { name: 'Hacked' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent category', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.update('rest-1', 'nonexistent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException on unique constraint violation', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Test',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.category.update.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.update('rest-1', 'cat-1', { sortOrder: 99 }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete category when no products exist', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Empty',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.product.count.mockResolvedValue(0);
      prisma.category.delete.mockResolvedValue({} as never);

      await expect(
        service.remove('rest-1', 'cat-1'),
      ).resolves.toBeUndefined();
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
      });
    });

    it('should throw ConflictException when products exist', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'With Products',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.product.count.mockResolvedValue(3);

      await expect(
        service.remove('rest-1', 'cat-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject cross-restaurant category deletion', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-OTHER',
        name: 'Other',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.remove('rest-1', 'cat-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent category', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('rest-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('sanitized responses', () => {
    it('should not expose internal fields in category response', async () => {
      prisma.category.findFirst.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-1',
        name: 'Test',
        displayOrder: 0,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create('rest-1', { name: 'Test' });

      expect(result).not.toHaveProperty('archivedAt');
      expect(result).not.toHaveProperty('updatedAt');
      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          'id',
          'restaurantId',
          'name',
          'displayOrder',
          'isActive',
          'createdAt',
        ]),
      );
    });
  });
});
