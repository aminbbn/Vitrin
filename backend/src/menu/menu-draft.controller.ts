import {
  Body,
  Controller,
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
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { RestaurantMembershipGuard } from '../restaurants/guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from '../restaurants/guards/restaurant-role.guard.js';
import { RestaurantRoles } from '../restaurants/decorators/restaurant-roles.decorator.js';
import { MenuDraftService } from './menu-draft.service.js';
import { UpsertMenuDraftDto } from './draft/dto/upsert-menu-draft.dto.js';
import { MenuDraftResponseDto } from './dto/menu-draft-response.dto.js';

@ApiTags('menu-draft')
@Controller('restaurants/:restaurantId/branches/:branchId/draft')
export class MenuDraftController {
  constructor(private readonly menuDraftService: MenuDraftService) {}

  @Get()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current menu draft for a branch' })
  @ApiResponse({ status: 200, description: 'Menu draft' })
  @ApiResponse({ status: 404, description: 'No draft exists yet' })
  async getDraft(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
  ): Promise<MenuDraftResponseDto> {
    return this.menuDraftService.getDraft(restaurantId, branchId);
  }

  @Put()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update menu draft (upsert)' })
  @ApiResponse({ status: 200, description: 'Menu draft created or updated' })
  async upsertDraft(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Body() dto: UpsertMenuDraftDto,
  ): Promise<MenuDraftResponseDto> {
    return this.menuDraftService.upsertDraft(restaurantId, branchId, dto);
  }
}
