import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MediaService } from './media.service';
import { PrismaService } from '../prisma/prisma.service';

function createMockPrisma() {
  return {
    restaurant: {
      findUnique: jest.fn(),
    },
    mediaAsset: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
}

describe('MediaService', () => {
  let service: MediaService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  describe('registerMedia', () => {
    it('should register a media asset', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.mediaAsset.create.mockResolvedValue({
        id: 'm1', uploadedByUserId: 'u1', restaurantId: 'r1', storageKey: 'key', publicUrl: 'url',
        mimeType: 'image/jpeg', fileSizeBytes: 1000, widthPx: 100, heightPx: 100,
        createdAt: new Date(), archivedAt: null,
      });

      const result = await service.registerMedia('r1', 'u1', {
        storageKey: 'key', publicUrl: 'url', mimeType: 'image/jpeg', fileSizeBytes: 1000,
      });

      expect(result.id).toBe('m1');
    });
  });

  describe('listMedia', () => {
    it('should list active media assets', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.mediaAsset.findMany.mockResolvedValue([]);

      const result = await service.listMedia('r1');
      expect(result).toHaveLength(0);
    });
  });

  describe('archiveMedia', () => {
    it('should archive a media asset', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.mediaAsset.findUnique.mockResolvedValue({ id: 'm1', restaurantId: 'r1', archivedAt: null });
      prisma.mediaAsset.update.mockResolvedValue({});

      await expect(service.archiveMedia('r1', 'm1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException for cross-restaurant media', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.mediaAsset.findUnique.mockResolvedValue({ id: 'm1', restaurantId: 'r2', archivedAt: null });

      await expect(service.archiveMedia('r1', 'm1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for already archived', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.mediaAsset.findUnique.mockResolvedValue({ id: 'm1', restaurantId: 'r1', archivedAt: new Date() });

      await expect(service.archiveMedia('r1', 'm1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('setProductImage', () => {
    it('should set product image', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.product.findUnique.mockResolvedValue({ id: 'p1', restaurantId: 'r1', archivedAt: null });
      prisma.mediaAsset.findUnique.mockResolvedValue({ id: 'm1', restaurantId: 'r1', archivedAt: null });
      prisma.product.update.mockResolvedValue({});

      await expect(service.setProductImage('r1', 'p1', 'm1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException for cross-restaurant product', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.product.findUnique.mockResolvedValue({ id: 'p1', restaurantId: 'r2', archivedAt: null });

      await expect(service.setProductImage('r1', 'p1', 'm1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProductImage', () => {
    it('should remove product image', async () => {
      prisma.restaurant.findUnique.mockResolvedValue({ id: 'r1', status: 'ACTIVE' });
      prisma.product.findUnique.mockResolvedValue({ id: 'p1', restaurantId: 'r1', archivedAt: null });
      prisma.product.update.mockResolvedValue({});

      await expect(service.removeProductImage('r1', 'p1')).resolves.toBeUndefined();
    });
  });
});
