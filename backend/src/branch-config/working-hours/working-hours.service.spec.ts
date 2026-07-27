import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WorkingHoursService } from './working-hours.service';
import { PrismaService } from '../../prisma/prisma.service';

function createMockPrisma() {
  return {
    branch: {
      findUnique: jest.fn(),
    },
    branchWorkingInterval: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    branchSpecialHours: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

describe('WorkingHoursService', () => {
  let service: WorkingHoursService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkingHoursService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WorkingHoursService>(WorkingHoursService);
  });

  describe('listWorkingHours', () => {
    it('should return intervals for a valid branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchWorkingInterval.findMany.mockResolvedValue([
        { id: 'i1', branchId: 'b1', weekday: 0, opensAt: '09:00', closesAt: '22:00', displayOrder: 0, createdAt: new Date(), updatedAt: new Date() },
      ]);

      const result = await service.listWorkingHours('r1', 'b1');
      expect(result).toHaveLength(1);
      expect(result[0].opensAt).toBe('09:00');
    });

    it('should throw NotFoundException for nonexistent branch', async () => {
      prisma.branch.findUnique.mockResolvedValue(null);
      await expect(service.listWorkingHours('r1', 'b1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsertWorkingHours', () => {
    it('should replace all working hours', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        prisma.branchWorkingInterval.deleteMany.mockResolvedValue({ count: 3 });
        prisma.branchWorkingInterval.create.mockResolvedValue({
          id: 'i1', branchId: 'b1', weekday: 0, opensAt: '09:00', closesAt: '22:00', displayOrder: 0, createdAt: new Date(), updatedAt: new Date(),
        });
        return fn(prisma);
      });

      const result = await service.upsertWorkingHours('r1', 'b1', {
        intervals: [{ weekday: 0, opensAt: '09:00', closesAt: '22:00' }],
      });

      expect(result).toHaveLength(1);
      expect(prisma.branchWorkingInterval.deleteMany).toHaveBeenCalledWith({ where: { branchId: 'b1' } });
    });

    it('should reject invalid time format', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });

      await expect(
        service.upsertWorkingHours('r1', 'b1', {
          intervals: [{ weekday: 0, opensAt: '9am', closesAt: '22:00' }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow empty intervals', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        prisma.branchWorkingInterval.deleteMany.mockResolvedValue({ count: 0 });
        return fn(prisma);
      });

      const result = await service.upsertWorkingHours('r1', 'b1', { intervals: [] });
      expect(result).toHaveLength(0);
    });
  });

  describe('upsertSpecialHours', () => {
    it('should upsert special hours', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchSpecialHours.upsert.mockResolvedValue({
        id: 'sh1', branchId: 'b1', localDate: new Date('2026-01-01'), isClosed: true, opensAt: null, closesAt: null, note: 'Holiday', createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.upsertSpecialHours('r1', 'b1', {
        localDate: '2026-01-01',
        isClosed: true,
        note: 'Holiday',
      });

      expect(result.isClosed).toBe(true);
    });
  });

  describe('removeSpecialHours', () => {
    it('should delete special hours', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchSpecialHours.findUnique.mockResolvedValue({ id: 'sh1', branchId: 'b1' });
      prisma.branchSpecialHours.delete.mockResolvedValue({});

      await expect(service.removeSpecialHours('r1', 'b1', '2026-01-01')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if special hours not found', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.branchSpecialHours.findUnique.mockResolvedValue(null);

      await expect(service.removeSpecialHours('r1', 'b1', '2026-01-01')).rejects.toThrow(NotFoundException);
    });
  });
});
