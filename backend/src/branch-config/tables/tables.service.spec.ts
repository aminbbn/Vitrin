import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TablesService } from './tables.service';
import { PrismaService } from '../../prisma/prisma.service';

function createMockPrisma() {
  return {
    branch: {
      findUnique: jest.fn(),
    },
    branchTable: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('TablesService', () => {
  let service: TablesService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TablesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TablesService>(TablesService);
  });

  describe('list', () => {
    it('should return tables for a valid branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchTable.findMany.mockResolvedValue([
        { id: 't1', branchId: 'b1', tableNumber: '5', capacity: 4, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
      ]);

      const result = await service.list('r1', 'b1');
      expect(result).toHaveLength(1);
      expect(result[0].tableNumber).toBe('5');
    });

    it('should throw NotFoundException for nonexistent branch', async () => {
      prisma.branch.findUnique.mockResolvedValue(null);
      await expect(service.list('r1', 'b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-restaurant branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r2', status: 'ACTIVE' });
      await expect(service.list('r1', 'b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for inactive branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'SUSPENDED' });
      await expect(service.list('r1', 'b1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a table', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchTable.create.mockResolvedValue({
        id: 't1', branchId: 'b1', tableNumber: '5', capacity: 4, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.create('r1', 'b1', { tableNumber: '5', capacity: 4 });
      expect(result.tableNumber).toBe('5');
      expect(result.capacity).toBe(4);
    });

    it('should create a table without capacity', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchTable.create.mockResolvedValue({
        id: 't1', branchId: 'b1', tableNumber: 'VIP-1', capacity: null, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.create('r1', 'b1', { tableNumber: 'VIP-1' });
      expect(result.capacity).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a table', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b1' });
      prisma.branchTable.update.mockResolvedValue({
        id: 't1', branchId: 'b1', tableNumber: '5A', capacity: 6, status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.update('r1', 'b1', 't1', { tableNumber: '5A', capacity: 6 });
      expect(result.tableNumber).toBe('5A');
    });

    it('should throw NotFoundException for cross-branch table', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b2' });

      await expect(service.update('r1', 'b1', 't1', { tableNumber: '5A' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a table', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b1' });
      prisma.branchTable.delete.mockResolvedValue({});

      await expect(service.remove('r1', 'b1', 't1')).resolves.toBeUndefined();
    });
  });
});
