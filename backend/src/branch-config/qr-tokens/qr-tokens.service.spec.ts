import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QrTokensService } from './qr-tokens.service';
import { PrismaService } from '../../prisma/prisma.service';

function createMockPrisma() {
  return {
    branch: {
      findUnique: jest.fn(),
    },
    branchTable: {
      findUnique: jest.fn(),
    },
    tableQrToken: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

describe('QrTokensService', () => {
  let service: QrTokensService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QrTokensService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<QrTokensService>(QrTokensService);
  });

  describe('getActiveToken', () => {
    it('should return active token', async () => {
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b1' });
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.tableQrToken.findFirst.mockResolvedValue({
        id: 'q1', tableId: 't1', token: 'abc123', status: 'ACTIVE', revokedAt: null, createdAt: new Date(),
      });

      const result = await service.getActiveToken('r1', 'b1', 't1');
      expect(result.token).toBe('abc123');
      expect(result.status).toBe('ACTIVE');
    });

    it('should throw NotFoundException if no active token', async () => {
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b1' });
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.tableQrToken.findFirst.mockResolvedValue(null);

      await expect(service.getActiveToken('r1', 'b1', 't1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-branch table', async () => {
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b2' });
      await expect(service.getActiveToken('r1', 'b1', 't1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateToken', () => {
    it('should generate a new token and revoke old ones', async () => {
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b1' });
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        prisma.tableQrToken.updateMany.mockResolvedValue({ count: 1 });
        prisma.tableQrToken.create.mockResolvedValue({
          id: 'q2', tableId: 't1', token: 'new-token', status: 'ACTIVE', revokedAt: null, createdAt: new Date(),
        });
        return fn(prisma);
      });

      const result = await service.generateToken('r1', 'b1', 't1');
      expect(result.token).toBeDefined();
      expect(prisma.tableQrToken.updateMany).toHaveBeenCalledWith({
        where: { tableId: 't1', status: 'ACTIVE' },
        data: { status: 'REVOKED', revokedAt: expect.any(Date) },
      });
    });
  });

  describe('revokeToken', () => {
    it('should revoke active token', async () => {
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b1' });
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.tableQrToken.findFirst.mockResolvedValue({
        id: 'q1', tableId: 't1', token: 'abc', status: 'ACTIVE', revokedAt: null, createdAt: new Date(),
      });
      prisma.tableQrToken.update.mockResolvedValue({});

      await expect(service.revokeToken('r1', 'b1', 't1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if no active token', async () => {
      prisma.branchTable.findUnique.mockResolvedValue({ id: 't1', branchId: 'b1' });
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.tableQrToken.findFirst.mockResolvedValue(null);

      await expect(service.revokeToken('r1', 'b1', 't1')).rejects.toThrow(NotFoundException);
    });
  });
});
