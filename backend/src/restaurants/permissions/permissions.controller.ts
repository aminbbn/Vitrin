import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard.js';
import { RestaurantMembershipGuard } from '../guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from '../guards/restaurant-role.guard.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { PermissionsService } from './permissions.service.js';
import { GrantPermissionsDto } from './dto/grant-permissions.dto.js';
import { PermissionResponseDto } from './dto/permission-response.dto.js';

@ApiTags('permissions')
@Controller('restaurants/:restaurantId/members/:membershipId/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List permissions for a membership (OWNER only)' })
  @ApiResponse({ status: 200, description: 'List of permissions' })
  @ApiResponse({ status: 403, description: 'Only OWNER can manage permissions' })
  async list(
    @Param('restaurantId') restaurantId: string,
    @Param('membershipId') membershipId: string,
    @CurrentUser() user: { sub: string },
  ): Promise<PermissionResponseDto[]> {
    return this.permissionsService.listPermissions(
      restaurantId,
      membershipId,
      user.sub,
    );
  }

  @Put()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Grant permissions to a membership (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Permissions granted' })
  @ApiResponse({ status: 403, description: 'Only OWNER can manage permissions' })
  async grant(
    @Param('restaurantId') restaurantId: string,
    @Param('membershipId') membershipId: string,
    @Body() dto: GrantPermissionsDto,
    @CurrentUser() user: { sub: string },
  ): Promise<PermissionResponseDto[]> {
    return this.permissionsService.grantPermissions(
      restaurantId,
      membershipId,
      dto,
      user.sub,
    );
  }

  @Delete(':code')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke a permission from a membership (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Permission revoked' })
  @ApiResponse({ status: 403, description: 'Only OWNER can manage permissions' })
  async revoke(
    @Param('restaurantId') restaurantId: string,
    @Param('membershipId') membershipId: string,
    @Param('code') code: string,
    @CurrentUser() user: { sub: string },
  ): Promise<void> {
    return this.permissionsService.revokePermission(
      restaurantId,
      membershipId,
      code,
      user.sub,
    );
  }
}
