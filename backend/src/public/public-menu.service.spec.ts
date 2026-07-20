import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, GoneException } from '@nestjs/common';
import { PublicMenuService } from './public-menu.service';
import { PrismaService } from '../prisma/prisma.service';

function createMockPrisma() {
  return {
    tableQrToken: {
      findUnique: jest.fn(),
    },
    branch: {
      findUnique: jest.fn(),
    },
    menuPublication: {
      findFirst: jest.fn(),
    },
  };
}

describe('PublicMenuService', () => {
  let service: PublicMenuService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicMenuService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PublicMenuService>(PublicMenuService);
  });

  describe('resolveQrToken', () => {
    it('should resolve a valid QR token to a menu', async () => {
      prisma.tableQrToken.findUnique.mockResolvedValue({
        id: 'q1', token: 'valid-token', status: 'ACTIVE',
        table: {
          id: 't1', tableNumber: '5',
          branch: {
            id: 'b1', name: 'Main Branch', status: 'ACTIVE', publicMenuEnabled: true,
            timezone: 'Asia/Tehran', currencyCode: 'IRR',
            restaurant: { name: 'Test Restaurant' },
          },
        },
      });
      prisma.menuPublication.findFirst.mockResolvedValue({
        id: 'pub1', version: 1, snapshot: { categories: [] }, createdAt: new Date(),
      });
      prisma.branch.findUnique.mockResolvedValue({
        name: 'Main Branch', timezone: 'Asia/Tehran', currencyCode: 'IRR',
      });

      const result = await service.resolveQrToken('valid-token');
      expect(result.tableNumber).toBe('5');
      expect(result.branchName).toBe('Main Branch');
      expect(result.restaurantName).toBe('Test Restaurant');
    });

    it('should throw NotFoundException for invalid token', async () => {
      prisma.tableQrToken.findUnique.mockResolvedValue(null);
      await expect(service.resolveQrToken('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for revoked token', async () => {
      prisma.tableQrToken.findUnique.mockResolvedValue({
        id: 'q1', token: 'revoked', status: 'REVOKED',
        table: { id: 't1', tableNumber: '5', branch: { id: 'b1', status: 'ACTIVE', publicMenuEnabled: true, restaurant: { name: 'R' } } },
      });
      await expect(service.resolveQrToken('revoked')).rejects.toThrow(NotFoundException);
    });

    it('should throw GoneException for suspended branch', async () => {
      prisma.tableQrToken.findUnique.mockResolvedValue({
        id: 'q1', token: 'tok', status: 'ACTIVE',
        table: { id: 't1', tableNumber: '5', branch: { id: 'b1', status: 'SUSPENDED', publicMenuEnabled: true, restaurant: { name: 'R' } } },
      });
      await expect(service.resolveQrToken('tok')).rejects.toThrow(GoneException);
    });

    it('should throw GoneException for disabled public menu', async () => {
      prisma.tableQrToken.findUnique.mockResolvedValue({
        id: 'q1', token: 'tok', status: 'ACTIVE',
        table: { id: 't1', tableNumber: '5', branch: { id: 'b1', status: 'ACTIVE', publicMenuEnabled: false, restaurant: { name: 'R' } } },
      });
      await expect(service.resolveQrToken('tok')).rejects.toThrow(GoneException);
    });

    it('should throw NotFoundException if no publication exists', async () => {
      prisma.tableQrToken.findUnique.mockResolvedValue({
        id: 'q1', token: 'tok', status: 'ACTIVE',
        table: { id: 't1', tableNumber: '5', branch: { id: 'b1', status: 'ACTIVE', publicMenuEnabled: true, restaurant: { name: 'R' } } },
      });
      prisma.menuPublication.findFirst.mockResolvedValue(null);
      await expect(service.resolveQrToken('tok')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPublicMenu', () => {
    it('should return published menu for a branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({
        id: 'b1', name: 'Main', status: 'ACTIVE', publicMenuEnabled: true,
        restaurant: { name: 'Test Restaurant' },
      });
      prisma.menuPublication.findFirst.mockResolvedValue({
        id: 'pub1', version: 1, snapshot: { categories: [] }, createdAt: new Date(),
      });

      const result = await service.getPublicMenu('b1');
      expect(result.branchId).toBe('b1');
    });

    it('should throw NotFoundException for nonexistent branch', async () => {
      prisma.branch.findUnique.mockResolvedValue(null);
      await expect(service.getPublicMenu('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
