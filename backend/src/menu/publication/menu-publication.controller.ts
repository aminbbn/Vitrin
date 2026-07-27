import {
  Controller,
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
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { MenuPublicationService } from './menu-publication.service.js';
import { PublicationResponseDto } from './dto/publication-response.dto.js';

@ApiTags('menu-publication')
@Controller('restaurants/:restaurantId/branches/:branchId')
export class MenuPublicationController {
  constructor(
    private readonly menuPublicationService: MenuPublicationService,
  ) {}

  @Post('publish')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish current draft (creates immutable snapshot)' })
  @ApiResponse({ status: 201, description: 'Publication created' })
  @ApiResponse({ status: 400, description: 'No draft exists' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async publish(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @CurrentUser() user: { sub: string },
  ): Promise<PublicationResponseDto> {
    return this.menuPublicationService.publish(restaurantId, branchId, user.sub);
  }

  @Get('publications')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List publication history' })
  @ApiResponse({ status: 200, description: 'List of publications' })
  async listPublications(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
  ): Promise<PublicationResponseDto[]> {
    return this.menuPublicationService.listPublications(restaurantId, branchId);
  }

  @Get('publications/:publicationId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific publication' })
  @ApiResponse({ status: 200, description: 'Publication details' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async getPublication(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('publicationId') publicationId: string,
  ): Promise<PublicationResponseDto> {
    return this.menuPublicationService.getPublication(
      restaurantId,
      branchId,
      publicationId,
    );
  }

  @Post('rollback/:publicationId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rollback to a previous publication (creates new version)' })
  @ApiResponse({ status: 201, description: 'Rollback publication created' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Target publication not found' })
  async rollback(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('publicationId') publicationId: string,
    @CurrentUser() user: { sub: string },
  ): Promise<PublicationResponseDto> {
    return this.menuPublicationService.rollback(
      restaurantId,
      branchId,
      publicationId,
      user.sub,
    );
  }
}
