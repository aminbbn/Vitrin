import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../../prisma/prisma.service';

function createMockPrisma() {
  return {
    restaurantMembership: {
      findUnique: jest.fn(),
    },
    membershipPermission: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  describe('listPermissions', () => {
    it('should list permissions for a membership', async () => {
      prisma.restaurantMembership.findUnique
        .mockResolvedValueOnce({ id: 'owner-m', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' })
        .mockResolvedValueOnce({ id: 'mgr-m', role: 'MANAGER', status: 'ACTIVE', restaurantId: 'r1' });
      prisma.membershipPermission.findMany.mockResolvedValue([
        { id: 'p1', membershipId: 'mgr-m', permission: 'MENU_PUBLISH', grantedByUserId: 'u1', grantedAt: new Date() },
      ]);

      const result = await service.listPermissions('r1', 'mgr-m', 'owner-u');
      expect(result).toHaveLength(1);
      expect(result[0].permission).toBe('MENU_PUBLISH');
    });

    it('should throw ForbiddenException for non-OWNER', async () => {
      prisma.restaurantMembership.findUnique.mockResolvedValue({ id: 'mgr-m', role: 'MANAGER', status: 'ACTIVE', restaurantId: 'r1' });

      await expect(service.listPermissions('r1', 'mgr-m', 'mgr-u')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException for cross-restaurant membership', async () => {
      prisma.restaurantMembership.findUnique
        .mockResolvedValueOnce({ id: 'owner-m', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' })
        .mockResolvedValueOnce({ id: 'other-m', role: 'MANAGER', status: 'ACTIVE', restaurantId: 'r2' });

      await expect(service.listPermissions('r1', 'other-m', 'owner-u')).rejects.toThrow(NotFoundException);
    });
  });

  describe('grantPermissions', () => {
    it('should grant permissions', async () => {
      prisma.restaurantMembership.findUnique
        .mockResolvedValueOnce({ id: 'owner-m', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' })
        .mockResolvedValueOnce({ id: 'mgr-m', role: 'MANAGER', status: 'ACTIVE', restaurantId: 'r1' });
      prisma.membershipPermission.findUnique.mockResolvedValue(null);
      prisma.membershipPermission.create.mockResolvedValue({
        id: 'p1', membershipId: 'mgr-m', permission: 'MENU_PUBLISH', grantedByUserId: 'owner-u', grantedAt: new Date(),
      });

      const result = await service.grantPermissions('r1', 'mgr-m', { permissions: ['MENU_PUBLISH'] }, 'owner-u');
      expect(result).toHaveLength(1);
    });

    it('should not duplicate existing permissions', async () => {
      prisma.restaurantMembership.findUnique
        .mockResolvedValueOnce({ id: 'owner-m', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' })
        .mockResolvedValueOnce({ id: 'mgr-m', role: 'MANAGER', status: 'ACTIVE', restaurantId: 'r1' });
      prisma.membershipPermission.findUnique.mockResolvedValue({
        id: 'existing', membershipId: 'mgr-m', permission: 'MENU_PUBLISH', grantedByUserId: 'u1', grantedAt: new Date(),
      });

      const result = await service.grantPermissions('r1', 'mgr-m', { permissions: ['MENU_PUBLISH'] }, 'owner-u');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('existing');
    });

    it('should throw BadRequestException for OWNER target', async () => {
      prisma.restaurantMembership.findUnique
        .mockResolvedValueOnce({ id: 'owner-m', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' })
        .mockResolvedValueOnce({ id: 'other-owner', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' });

      await expect(
        service.grantPermissions('r1', 'other-owner', { permissions: ['MENU_PUBLISH'] }, 'owner-u'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('revokePermission', () => {
    it('should revoke a permission', async () => {
      prisma.restaurantMembership.findUnique
        .mockResolvedValueOnce({ id: 'owner-m', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' })
        .mockResolvedValueOnce({ id: 'mgr-m', role: 'MANAGER', status: 'ACTIVE', restaurantId: 'r1' });
      prisma.membershipPermission.findUnique.mockResolvedValue({
        id: 'p1', membershipId: 'mgr-m', permission: 'MENU_PUBLISH', grantedByUserId: 'u1', grantedAt: new Date(),
      });
      prisma.membershipPermission.delete.mockResolvedValue({});

      await expect(service.revokePermission('r1', 'mgr-m', 'MENU_PUBLISH', 'owner-u')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException for nonexistent permission', async () => {
      prisma.restaurantMembership.findUnique
        .mockResolvedValueOnce({ id: 'owner-m', role: 'OWNER', status: 'ACTIVE', restaurantId: 'r1' })
        .mockResolvedValueOnce({ id: 'mgr-m', role: 'MANAGER', status: 'ACTIVE', restaurantId: 'r1' });
      prisma.membershipPermission.findUnique.mockResolvedValue(null);

      await expect(service.revokePermission('r1', 'mgr-m', 'MENU_PUBLISH', 'owner-u')).rejects.toThrow(NotFoundException);
    });
  });
});
