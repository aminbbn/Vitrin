import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard.js';
import { RestaurantMembershipGuard } from '../../restaurants/guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from '../../restaurants/guards/restaurant-role.guard.js';
import { RestaurantRoles } from '../../restaurants/decorators/restaurant-roles.decorator.js';
import { QrTokensService } from './qr-tokens.service.js';
import { QrTokenResponseDto } from './dto/qr-token-response.dto.js';

@ApiTags('branch-qr-tokens')
@Controller('restaurants/:restaurantId/branches/:branchId/tables/:tableId/qr-token')
export class QrTokensController {
  constructor(private readonly qrTokensService: QrTokensService) {}

  @Get()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active QR token for a table' })
  @ApiResponse({ status: 200, description: 'Active QR token' })
  async getActive(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('tableId') tableId: string,
  ): Promise<QrTokenResponseDto> {
    return this.qrTokensService.getActiveToken(restaurantId, branchId, tableId);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate or regenerate QR token for a table' })
  @ApiResponse({ status: 201, description: 'New QR token (previous one revoked)' })
  async generate(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('tableId') tableId: string,
  ): Promise<QrTokenResponseDto> {
    return this.qrTokensService.generateToken(restaurantId, branchId, tableId);
  }

  @Delete()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke active QR token for a table' })
  @ApiResponse({ status: 200, description: 'QR token revoked' })
  async revoke(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('tableId') tableId: string,
  ): Promise<void> {
    return this.qrTokensService.revokeToken(restaurantId, branchId, tableId);
  }
}
