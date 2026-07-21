import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MenuDraftService } from './menu-draft.service';
import { PrismaService } from '../prisma/prisma.service';

function createMockPrisma() {
  return {
    branch: {
      findUnique: jest.fn(),
    },
    menuDraft: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
}

describe('MenuDraftService', () => {
  let service: MenuDraftService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuDraftService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MenuDraftService>(MenuDraftService);
  });

  describe('getDraft', () => {
    it('should return existing draft', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue({
        id: 'd1', branchId: 'b1', layout: { type: 'grid' }, theme: { color: 'dark' },
        categoryConfig: {}, productConfig: {}, displaySettings: {},
        lastPublishedAt: null, createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.getDraft('r1', 'b1');
      expect(result.id).toBe('d1');
      expect(result.layout).toEqual({ type: 'grid' });
    });

    it('should throw NotFoundException if no draft exists', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue(null);

      await expect(service.getDraft('r1', 'b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for nonexistent branch', async () => {
      prisma.branch.findUnique.mockResolvedValue(null);
      await expect(service.getDraft('r1', 'b1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for inactive branch', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'SUSPENDED' });
      await expect(service.getDraft('r1', 'b1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('upsertDraft', () => {
    it('should create a new draft', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue(null);
      prisma.menuDraft.create.mockResolvedValue({
        id: 'd1', branchId: 'b1', layout: { type: 'list' }, theme: {},
        categoryConfig: {}, productConfig: {}, displaySettings: {},
        lastPublishedAt: null, createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.upsertDraft('r1', 'b1', {
        layout: { type: 'list' },
      });

      expect(result.layout).toEqual({ type: 'list' });
      expect(prisma.menuDraft.create).toHaveBeenCalled();
    });

    it('should update an existing draft', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue({
        id: 'd1', branchId: 'b1', layout: { type: 'grid' }, theme: {},
        categoryConfig: {}, productConfig: {}, displaySettings: {},
        lastPublishedAt: null, createdAt: new Date(), updatedAt: new Date(),
      });
      prisma.menuDraft.update.mockResolvedValue({
        id: 'd1', branchId: 'b1', layout: { type: 'list' }, theme: { color: 'light' },
        categoryConfig: {}, productConfig: {}, displaySettings: {},
        lastPublishedAt: null, createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.upsertDraft('r1', 'b1', {
        layout: { type: 'list' },
        theme: { color: 'light' },
      });

      expect(result.layout).toEqual({ type: 'list' });
      expect(result.theme).toEqual({ color: 'light' });
    });

    it('should use default empty objects for unspecified fields on create', async () => {
      prisma.branch.findUnique.mockResolvedValue({ id: 'b1', restaurantId: 'r1', status: 'ACTIVE' });
      prisma.menuDraft.findUnique.mockResolvedValue(null);
      prisma.menuDraft.create.mockResolvedValue({
        id: 'd1', branchId: 'b1', layout: {}, theme: {},
        categoryConfig: {}, productConfig: {}, displaySettings: {},
        lastPublishedAt: null, createdAt: new Date(), updatedAt: new Date(),
      });

      const result = await service.upsertDraft('r1', 'b1', {});
      expect(result.layout).toEqual({});
    });
  });
});
