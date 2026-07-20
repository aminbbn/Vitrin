import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MenuPublicationService } from './menu-publication.service';
import { PrismaService } from '../../prisma/prisma.service';

function createMockPrisma() {
  return {
    branch: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    menuDraft: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    menuPublication: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    branchProduct: {
      findMany: jest.fn(),
    },
    restaurantMembership: {
      findUnique: jest.fn(),
    },
    membershipPermission: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

describe('MenuPublicationService', () => {
  let service: MenuPublicationService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuPublicationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MenuPublicationService>(MenuPublicationService);
  });

  describe('publish', () => {
    const mockBranch = { id: 'b1', restaurantId: 'r1', status: 'ACTIVE', name: 'Main', timezone: 'Asia/Tehran', currencyCode: 'IRR' };
    const mockDraft = {
      id: 'd1', branchId: 'b1', layout: {}, theme: {}, categoryConfig: {}, productConfig: {}, displaySettings: {},
      lastPublishedAt: null, createdAt: new Date(), updatedAt: new Date(),
    };

    it('should publish a draft as a new publication', async () => {
      prisma.branch.findUnique.mockResolvedValue(mockBranch);
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'm1', role: 'OWNER', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue(mockDraft);
      prisma.branchProduct.findMany.mockResolvedValue([]);
      prisma.menuPublication.findFirst.mockResolvedValue(null);

      prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        prisma.menuPublication.create.mockResolvedValue({
          id: 'pub1', branchId: 'b1', version: 1, schemaVersion: 1,
          snapshot: {}, publishedByUserId: 'u1', createdAt: new Date(),
        });
        prisma.branch.update.mockResolvedValue({});
        prisma.menuDraft.update.mockResolvedValue({});
        return fn(prisma);
      });

      const result = await service.publish('r1', 'b1', 'u1');
      expect(result.version).toBe(1);
      expect(result.branchId).toBe('b1');
    });

    it('should increment version number', async () => {
      prisma.branch.findUnique.mockResolvedValue(mockBranch);
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'm1', role: 'OWNER', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue(mockDraft);
      prisma.branchProduct.findMany.mockResolvedValue([]);
      prisma.menuPublication.findFirst.mockResolvedValue({ version: 5 });

      prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        prisma.menuPublication.create.mockResolvedValue({
          id: 'pub6', branchId: 'b1', version: 6, schemaVersion: 1,
          snapshot: {}, publishedByUserId: 'u1', createdAt: new Date(),
        });
        prisma.branch.update.mockResolvedValue({});
        prisma.menuDraft.update.mockResolvedValue({});
        return fn(prisma);
      });

      const result = await service.publish('r1', 'b1', 'u1');
      expect(result.version).toBe(6);
    });

    it('should throw BadRequestException if no draft exists', async () => {
      prisma.branch.findUnique.mockResolvedValue(mockBranch);
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'm1', role: 'OWNER', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue(null);

      await expect(service.publish('r1', 'b1', 'u1')).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException for MANAGER without permission', async () => {
      prisma.branch.findUnique.mockResolvedValue(mockBranch);
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'm1', role: 'MANAGER', status: 'ACTIVE' });
      prisma.membershipPermission.findUnique.mockResolvedValue(null);

      await expect(service.publish('r1', 'b1', 'u1')).rejects.toThrow(ForbiddenException);
    });

    it('should allow MANAGER with MENU_PUBLISH permission', async () => {
      prisma.branch.findUnique.mockResolvedValue(mockBranch);
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'm1', role: 'MANAGER', status: 'ACTIVE' });
      prisma.membershipPermission.findUnique.mockResolvedValue({ id: 'p1', permission: 'MENU_PUBLISH' });
      prisma.menuDraft.findUnique.mockResolvedValue(mockDraft);
      prisma.branchProduct.findMany.mockResolvedValue([]);
      prisma.menuPublication.findFirst.mockResolvedValue(null);

      prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        prisma.menuPublication.create.mockResolvedValue({
          id: 'pub1', branchId: 'b1', version: 1, schemaVersion: 1,
          snapshot: {}, publishedByUserId: 'u1', createdAt: new Date(),
        });
        prisma.branch.update.mockResolvedValue({});
        prisma.menuDraft.update.mockResolvedValue({});
        return fn(prisma);
      });

      const result = await service.publish('r1', 'b1', 'u1');
      expect(result.version).toBe(1);
    });
  });

  describe('rollback', () => {
    it('should create new publication from older snapshot', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'm1', role: 'OWNER', status: 'ACTIVE' });
      prisma.menuPublication.findFirst
        .mockResolvedValueOnce({ id: 'target', branchId: 'b1', version: 3, schemaVersion: 1, snapshot: { data: 'old' }, publishedByUserId: 'u1', createdAt: new Date() })
        .mockResolvedValueOnce({ version: 5 });

      prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        prisma.menuPublication.create.mockResolvedValue({
          id: 'pub6', branchId: 'b1', version: 6, schemaVersion: 1,
          snapshot: { data: 'old' }, publishedByUserId: 'u1', createdAt: new Date(),
        });
        prisma.branch.update.mockResolvedValue({});
        return fn(prisma);
      });

      const result = await service.rollback('r1', 'b1', 'target', 'u1');
      expect(result.version).toBe(6);
      expect(result.snapshot).toEqual({ data: 'old' });
    });

    it('should throw NotFoundException for nonexistent target', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'm1', role: 'OWNER', status: 'ACTIVE' });
      prisma.menuPublication.findFirst.mockResolvedValue(null);

      await expect(service.rollback('r1', 'b1', 'nonexistent', 'u1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listPublications', () => {
    it('should list publications in descending version order', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.menuPublication.findMany.mockResolvedValue([
        { id: 'p2', branchId: 'b1', version: 2, schemaVersion: 1, snapshot: {}, publishedByUserId: 'u1', createdAt: new Date() },
        { id: 'p1', branchId: 'b1', version: 1, schemaVersion: 1, snapshot: {}, publishedByUserId: 'u1', createdAt: new Date() },
      ]);

      const result = await service.listPublications('r1', 'b1');
      expect(result).toHaveLength(2);
      expect(result[0].version).toBe(2);
    });
  });
});
