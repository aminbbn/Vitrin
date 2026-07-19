import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';

function createMockPrisma() {
  return {
    restaurant: {
      findUnique: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();
    prisma.restaurant.findUnique.mockResolvedValue({ id: 'rest-1' });
    prisma.category.findUnique.mockResolvedValue({
      id: 'cat-1',
      restaurantId: 'rest-1',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create a product with correct fields', async () => {
      prisma.product.create.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Grilled Chicken',
        displayName: 'Grilled Chicken',
        description: 'Juicy chicken',
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      });

      const result = await service.create('rest-1', {
        categoryId: 'cat-1',
        name: 'Grilled Chicken',
        description: 'Juicy chicken',
      });

      expect(result.id).toBe('prod-1');
      expect(result.name).toBe('Grilled Chicken');
      expect(result.displayName).toBe('Grilled Chicken');
      expect(result.description).toBe('Juicy chicken');
      expect(result.restaurantId).toBe('rest-1');
      expect(result.categoryId).toBe('cat-1');
    });

    it('should reject cross-restaurant category', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-OTHER',
      });

      await expect(
        service.create('rest-1', {
          categoryId: 'cat-1',
          name: 'Product',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent category', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.create('rest-1', {
          categoryId: 'nonexistent',
          name: 'Product',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent restaurant', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        service.create('nonexistent', {
          categoryId: 'cat-1',
          name: 'Product',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('list', () => {
    it('should return products scoped to the restaurant', async () => {
      prisma.product.findMany.mockResolvedValue([
        {
          id: 'prod-1',
          restaurantId: 'rest-1',
          categoryId: 'cat-1',
          name: 'Product 1',
          displayName: 'Product 1',
          description: null,
          imageMediaId: null,
          isActive: true,
          archivedAt: null,
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date(),
        },
        {
          id: 'prod-2',
          restaurantId: 'rest-1',
          categoryId: 'cat-2',
          name: 'Product 2',
          displayName: 'Product 2',
          description: null,
          imageMediaId: null,
          isActive: true,
          archivedAt: null,
          createdAt: new Date('2025-01-02'),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.list('rest-1');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Product 1');
      expect(result[1].name).toBe('Product 2');
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { restaurantId: 'rest-1', archivedAt: null },
        orderBy: [{ createdAt: 'asc' }],
      });
    });

    it('should filter by categoryId when provided', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      await service.list('rest-1', 'cat-1');

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          restaurantId: 'rest-1',
          archivedAt: null,
          categoryId: 'cat-1',
        },
        orderBy: [{ createdAt: 'asc' }],
      });
    });

    it('should reject cross-restaurant category filter', async () => {
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-1',
        restaurantId: 'rest-OTHER',
      });

      await expect(
        service.list('rest-1', 'cat-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return empty array for restaurant with no products', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      const result = await service.list('rest-1');

      expect(result).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should return product scoped to restaurant', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Grilled Chicken',
        displayName: 'Grilled Chicken',
        description: 'Juicy',
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
      });

      const result = await service.getOne('rest-1', 'prod-1');

      expect(result.id).toBe('prod-1');
      expect(result.name).toBe('Grilled Chicken');
    });

    it('should throw NotFoundException for cross-restaurant product', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-OTHER',
        categoryId: 'cat-1',
        name: 'Product',
        displayName: 'Product',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.getOne('rest-1', 'prod-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.getOne('rest-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update product name', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Old Name',
        displayName: 'Old Name',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.product.update.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'New Name',
        displayName: 'New Name',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update('rest-1', 'prod-1', {
        name: 'New Name',
      });

      expect(result.name).toBe('New Name');
      expect(result.displayName).toBe('New Name');
    });

    it('should update product category', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Test',
        displayName: 'Test',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-2',
        restaurantId: 'rest-1',
      });
      prisma.product.update.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-2',
        name: 'Test',
        displayName: 'Test',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update('rest-1', 'prod-1', {
        categoryId: 'cat-2',
      });

      expect(result.categoryId).toBe('cat-2');
    });

    it('should reject cross-restaurant product update', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-OTHER',
        categoryId: 'cat-1',
        name: 'Product',
        displayName: 'Product',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.update('rest-1', 'prod-1', { name: 'Hacked' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.update('rest-1', 'nonexistent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject cross-restaurant category on update', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Test',
        displayName: 'Test',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.category.findUnique.mockResolvedValue({
        id: 'cat-2',
        restaurantId: 'rest-OTHER',
      });

      await expect(
        service.update('rest-1', 'prod-1', { categoryId: 'cat-2' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete product', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Test',
        displayName: 'Test',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      prisma.product.delete.mockResolvedValue({} as never);

      await expect(
        service.remove('rest-1', 'prod-1'),
      ).resolves.toBeUndefined();
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
      });
    });

    it('should reject cross-restaurant product deletion', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-OTHER',
        categoryId: 'cat-1',
        name: 'Product',
        displayName: 'Product',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        service.remove('rest-1', 'prod-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('rest-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('sanitized responses', () => {
    it('should not expose price, discount, or availability fields', async () => {
      prisma.product.create.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Test',
        displayName: 'Test',
        description: null,
        imageMediaId: 'media-1',
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create('rest-1', {
        categoryId: 'cat-1',
        name: 'Test',
      });

      expect(result).not.toHaveProperty('imageMediaId');
      expect(result).not.toHaveProperty('archivedAt');
      expect(result).not.toHaveProperty('updatedAt');
      expect(result).not.toHaveProperty('branchPrice');
      expect(result).not.toHaveProperty('branchDiscountPrice');
      expect(result).not.toHaveProperty('availability');
      expect(result).not.toHaveProperty('orderingEnabled');
      expect(result).not.toHaveProperty('isVisible');
    });

    it('should expose correct fields in product response', async () => {
      prisma.product.create.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Test',
        displayName: 'Test',
        description: 'A test product',
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date(),
      });

      const result = await service.create('rest-1', {
        categoryId: 'cat-1',
        name: 'Test',
        description: 'A test product',
      });

      expect(Object.keys(result)).toEqual(
        expect.arrayContaining([
          'id',
          'restaurantId',
          'categoryId',
          'name',
          'displayName',
          'description',
          'isActive',
          'createdAt',
        ]),
      );
    });
  });

  describe('OWNER and MANAGER write access', () => {
    it('should allow OWNER to create product', async () => {
      prisma.product.create.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Product',
        displayName: 'Product',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create('rest-1', {
        categoryId: 'cat-1',
        name: 'Product',
      });

      expect(result.id).toBe('prod-1');
    });

    it('should allow MANAGER to create product', async () => {
      prisma.product.create.mockResolvedValue({
        id: 'prod-2',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Product',
        displayName: 'Product',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create('rest-1', {
        categoryId: 'cat-1',
        name: 'Product',
      });

      expect(result.id).toBe('prod-2');
    });
  });

  describe('read access for all active roles', () => {
    it('should allow listing products without role check', async () => {
      prisma.product.findMany.mockResolvedValue([
        {
          id: 'prod-1',
          restaurantId: 'rest-1',
          categoryId: 'cat-1',
          name: 'Product',
          displayName: 'Product',
          description: null,
          imageMediaId: null,
          isActive: true,
          archivedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.list('rest-1');

      expect(result).toHaveLength(1);
    });

    it('should allow getting single product without role check', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        categoryId: 'cat-1',
        name: 'Product',
        displayName: 'Product',
        description: null,
        imageMediaId: null,
        isActive: true,
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.getOne('rest-1', 'prod-1');

      expect(result.id).toBe('prod-1');
    });
  });
});
