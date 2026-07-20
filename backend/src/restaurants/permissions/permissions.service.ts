import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GrantPermissionsDto } from './dto/grant-permissions.dto.js';
import { PermissionResponseDto } from './dto/permission-response.dto.js';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPermissions(
    restaurantId: string,
    membershipId: string,
    requestorUserId: string,
  ): Promise<PermissionResponseDto[]> {
    await this.assertOwner(restaurantId, requestorUserId);
    await this.assertValidMembership(restaurantId, membershipId);

    const permissions = await this.prisma.membershipPermission.findMany({
      where: { membershipId },
      orderBy: { grantedAt: 'asc' },
    });

    return permissions.map((p) => this.toResponse(p));
  }

  async grantPermissions(
    restaurantId: string,
    membershipId: string,
    dto: GrantPermissionsDto,
    requestorUserId: string,
  ): Promise<PermissionResponseDto[]> {
    await this.assertOwner(restaurantId, requestorUserId);
    const membership = await this.assertValidMembership(restaurantId, membershipId);

    if (membership.role === 'OWNER') {
      throw new BadRequestException('OWNER already has all permissions implicitly');
    }

    const granted: PermissionResponseDto[] = [];

    for (const perm of dto.permissions) {
      const permissionCode = perm as 'MENU_PUBLISH' | 'MENU_ROLLBACK';

      const existing = await this.prisma.membershipPermission.findUnique({
        where: {
          membershipId_permission: { membershipId, permission: permissionCode },
        },
      });

      if (!existing) {
        const created = await this.prisma.membershipPermission.create({
          data: {
            membershipId,
            permission: permissionCode,
            grantedByUserId: requestorUserId,
          },
        });
        granted.push(this.toResponse(created));
      } else {
        granted.push(this.toResponse(existing));
      }
    }

    return granted;
  }

  async revokePermission(
    restaurantId: string,
    membershipId: string,
    permissionCode: string,
    requestorUserId: string,
  ): Promise<void> {
    await this.assertOwner(restaurantId, requestorUserId);
    await this.assertValidMembership(restaurantId, membershipId);

    const permission = await this.prisma.membershipPermission.findUnique({
      where: {
        membershipId_permission: {
          membershipId,
          permission: permissionCode as 'MENU_PUBLISH' | 'MENU_ROLLBACK',
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.prisma.membershipPermission.delete({
      where: { id: permission.id },
    });
  }

  private async assertOwner(
    restaurantId: string,
    userId: string,
  ): Promise<void> {
    const membership = await this.prisma.restaurantMembership.findUnique({
      where: { userId_restaurantId: { userId, restaurantId } },
      select: { role: true, status: true },
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new ForbiddenException('Not a member of this restaurant');
    }

    if (membership.role !== 'OWNER') {
      throw new ForbiddenException('Only OWNER can manage permissions');
    }
  }

  private async assertValidMembership(
    restaurantId: string,
    membershipId: string,
  ): Promise<{ id: string; role: string; status: string }> {
    const membership = await this.prisma.restaurantMembership.findUnique({
      where: { id: membershipId },
      select: { id: true, restaurantId: true, role: true, status: true },
    });

    if (!membership || membership.restaurantId !== restaurantId) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.status !== 'ACTIVE') {
      throw new BadRequestException('Membership is not active');
    }

    return membership;
  }

  private toResponse(p: {
    id: string;
    membershipId: string;
    permission: string;
    grantedByUserId: string;
    grantedAt: Date;
  }): PermissionResponseDto {
    return {
      id: p.id,
      membershipId: p.membershipId,
      permission: p.permission,
      grantedByUserId: p.grantedByUserId,
      grantedAt: p.grantedAt,
    };
  }
}
