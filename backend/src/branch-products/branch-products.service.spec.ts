import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BranchProductsService } from './branch-products.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

function createMockPrisma() {
  return {
    branch: {
      findUnique: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    branchProduct: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };
}

describe('BranchProductsService', () => {
  let service: BranchProductsService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BranchProductsService>(BranchProductsService);
  });

  describe('listCatalogProducts', () => {
    it('should list all active catalog products for the branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'Grilled Chicken',
          displayName: 'Grilled Chicken',
          description: 'Juicy',
          isActive: true,
          createdAt: new Date('2025-01-01'),
          category: { id: 'cat-1', name: 'Mains', displayOrder: 0 },
          branchProducts: [
            {
              branchPrice: 150000,
              branchDiscountPrice: 120000,
              availability: 'AVAILABLE',
              isVisible: true,
            },
          ],
        },
        {
          id: 'prod-2',
          name: 'Caesar Salad',
          displayName: 'Caesar Salad',
          description: null,
          isActive: true,
          createdAt: new Date('2025-01-02'),
          category: { id: 'cat-1', name: 'Mains', displayOrder: 0 },
          branchProducts: [],
        },
      ]);

      const result = await service.listCatalogProducts('rest-1', 'branch-1');

      expect(result).toHaveLength(2);
      expect(result[0].productId).toBe('prod-1');
      expect(result[0].branchPrice).toBe(150000);
      expect(result[0].branchDiscountPrice).toBe(120000);
      expect(result[0].isConfigured).toBe(true);
      expect(result[1].productId).toBe('prod-2');
      expect(result[1].branchPrice).toBeNull();
      expect(result[1].isConfigured).toBe(false);
    });

    it('should return empty array when no active products exist', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findMany.mockResolvedValue([]);

      const result = await service.listCatalogProducts('rest-1', 'branch-1');

      expect(result).toEqual([]);
    });

    it('should throw NotFoundException for nonexistent branch', async () => {
      prisma.branch.findUnique.mockResolvedValue(null);

      await expect(
        service.listCatalogProducts('rest-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-restaurant branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-OTHER',
        status: 'ACTIVE',
      });

      await expect(
        service.listCatalogProducts('rest-1', 'branch-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for inactive branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'SUSPENDED',
      });

      await expect(
        service.listCatalogProducts('rest-1', 'branch-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should order products by category displayOrder then product createdAt', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findMany.mockResolvedValue([]);

      await service.listCatalogProducts('rest-1', 'branch-1');

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [
            { category: { displayOrder: 'asc' } },
            { createdAt: 'asc' },
          ],
        }),
      );
    });
  });

  describe('upsertBranchProduct', () => {
    it('should create a new branch product configuration', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.upsert.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 150000,
        branchDiscountPrice: null,
        availability: 'AVAILABLE',
        isVisible: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      });

      const result = await service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
        branchPrice: 150000,
      });

      expect(result.id).toBe('bp-1');
      expect(result.branchPrice).toBe(150000);
      expect(result.branchDiscountPrice).toBeNull();
      expect(result.availability).toBe('AVAILABLE');
      expect(result.isVisible).toBe(true);
      expect(prisma.branchProduct.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { branchId_productId: { branchId: 'branch-1', productId: 'prod-1' } },
        }),
      );
    });

    it('should fully replace an existing branch product configuration', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.upsert.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 200000,
        branchDiscountPrice: 180000,
        availability: 'UNAVAILABLE',
        isVisible: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      });

      const result = await service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
        branchPrice: 200000,
        branchDiscountPrice: 180000,
        availability: 'UNAVAILABLE',
        isVisible: false,
      });

      expect(result.branchPrice).toBe(200000);
      expect(result.branchDiscountPrice).toBe(180000);
      expect(result.availability).toBe('UNAVAILABLE');
      expect(result.isVisible).toBe(false);
    });

    it('should reject discount price not lower than branch price', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
          branchDiscountPrice: 100000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject discount price higher than branch price', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
          branchDiscountPrice: 150000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject negative branch price', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: -1,
        }),
      ).rejects.toThrow();
    });

    it('should reject negative discount price', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
          branchDiscountPrice: -1,
        }),
      ).rejects.toThrow();
    });

    it('should throw NotFoundException for nonexistent branch', async () => {
      prisma.branch.findUnique.mockResolvedValue(null);

      await expect(
        service.upsertBranchProduct('rest-1', 'nonexistent', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-restaurant branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-OTHER',
        status: 'ACTIVE',
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for inactive branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'SUSPENDED',
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for nonexistent product', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'nonexistent', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-restaurant product', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-OTHER',
        archivedAt: null,
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for archived product', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: new Date(),
      });

      await expect(
        service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should not accept branchId in the body', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.upsert.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 100000,
        branchDiscountPrice: null,
        availability: 'AVAILABLE',
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
        branchPrice: 100000,
      } as never);

      expect(prisma.branchProduct.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ branchId: 'branch-1' }),
        }),
      );
    });
  });

  describe('updateBranchProduct', () => {
    it('should partially update an existing branch product', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.findUnique.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 150000,
        branchDiscountPrice: 120000,
        availability: 'AVAILABLE',
        isVisible: true,
      });
      prisma.branchProduct.update.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 200000,
        branchDiscountPrice: 120000,
        availability: 'AVAILABLE',
        isVisible: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      });

      const result = await service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
        branchPrice: 200000,
      });

      expect(result.branchPrice).toBe(200000);
      expect(result.branchDiscountPrice).toBe(120000);
    });

    it('should update only visibility', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.findUnique.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 150000,
        branchDiscountPrice: 120000,
        availability: 'AVAILABLE',
        isVisible: true,
      });
      prisma.branchProduct.update.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 150000,
        branchDiscountPrice: 120000,
        availability: 'AVAILABLE',
        isVisible: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      });

      const result = await service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
        isVisible: false,
      });

      expect(result.isVisible).toBe(false);
      expect(result.branchPrice).toBe(150000);
    });

    it('should validate final discount against final branch price during partial update', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.findUnique.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 200000,
        branchDiscountPrice: 150000,
        availability: 'AVAILABLE',
        isVisible: true,
      });

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when no branch product exists', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.findUnique.mockResolvedValue(null);

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject negative price on update', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.findUnique.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 150000,
        branchDiscountPrice: null,
        availability: 'AVAILABLE',
        isVisible: true,
      });

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: -1,
        }),
      ).rejects.toThrow();
    });

    it('should throw NotFoundException for nonexistent branch', async () => {
      prisma.branch.findUnique.mockResolvedValue(null);

      await expect(
        service.updateBranchProduct('rest-1', 'nonexistent', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-restaurant branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-OTHER',
        status: 'ACTIVE',
      });

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for inactive branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'SUSPENDED',
      });

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for nonexistent product', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'nonexistent', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-restaurant product', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-OTHER',
        archivedAt: null,
      });

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for archived product', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: new Date(),
      });

      await expect(
        service.updateBranchProduct('rest-1', 'branch-1', 'prod-1', {
          branchPrice: 100000,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('sanitized responses', () => {
    it('should not expose internal Prisma fields in upsert response', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.upsert.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 100000,
        branchDiscountPrice: null,
        availability: 'AVAILABLE',
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
        branchPrice: 100000,
      });

      expect(result).not.toHaveProperty('branch');
      expect(result).not.toHaveProperty('product');
      expect(result).not.toHaveProperty('__typename');
      const keys = Object.keys(result);
      expect(keys).toEqual(
        expect.arrayContaining([
          'id',
          'branchId',
          'productId',
          'branchPrice',
          'branchDiscountPrice',
          'availability',
          'isVisible',
          'createdAt',
          'updatedAt',
        ]),
      );
    });

    it('should not expose internal fields in list response', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findMany.mockResolvedValue([
        {
          id: 'prod-1',
          name: 'Test',
          displayName: 'Test',
          description: null,
          isActive: true,
          createdAt: new Date(),
          category: { id: 'cat-1', name: 'Mains', displayOrder: 0 },
          branchProducts: [],
        },
      ]);

      const result = await service.listCatalogProducts('rest-1', 'branch-1');

      expect(result[0]).not.toHaveProperty('imageMediaId');
      expect(result[0]).not.toHaveProperty('archivedAt');
      expect(result[0]).not.toHaveProperty('updatedAt');
      expect(result[0]).not.toHaveProperty('modifierGroups');
    });
  });

  describe('OWNER and MANAGER access', () => {
    it('should allow OWNER to upsert branch product (guard-level)', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.upsert.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 100000,
        branchDiscountPrice: null,
        availability: 'AVAILABLE',
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
        branchPrice: 100000,
      });

      expect(result.id).toBe('bp-1');
    });

    it('should allow MANAGER to upsert branch product (guard-level)', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findUnique.mockResolvedValue({
        id: 'prod-1',
        restaurantId: 'rest-1',
        archivedAt: null,
      });
      prisma.branchProduct.upsert.mockResolvedValue({
        id: 'bp-1',
        branchId: 'branch-1',
        productId: 'prod-1',
        branchPrice: 100000,
        branchDiscountPrice: null,
        availability: 'AVAILABLE',
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.upsertBranchProduct('rest-1', 'branch-1', 'prod-1', {
        branchPrice: 100000,
      });

      expect(result.id).toBe('bp-1');
    });

    it('should allow listing without role check (guard-level)', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'branch-1',
        restaurantId: 'rest-1',
        status: 'ACTIVE',
      });
      prisma.product.findMany.mockResolvedValue([]);

      const result = await service.listCatalogProducts('rest-1', 'branch-1');

      expect(result).toEqual([]);
    });
  });
});
