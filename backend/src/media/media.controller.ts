import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { MediaService } from './media.service.js';
import { RegisterMediaDto } from './dto/register-media.dto.js';
import { MediaAssetResponseDto } from './dto/media-asset-response.dto.js';

@ApiTags('media')
@Controller('restaurants/:restaurantId/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a media asset (client uploads to storage, registers URL here)' })
  @ApiResponse({ status: 201, description: 'Media asset registered' })
  async register(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: RegisterMediaDto,
  ): Promise<MediaAssetResponseDto> {
    return this.mediaService.registerMedia(restaurantId, user.sub, dto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List restaurant media assets' })
  @ApiResponse({ status: 200, description: 'List of media assets' })
  async list(
    @Param('restaurantId') restaurantId: string,
  ): Promise<MediaAssetResponseDto[]> {
    return this.mediaService.listMedia(restaurantId);
  }

  @Delete(':mediaId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archive a media asset' })
  @ApiResponse({ status: 200, description: 'Media asset archived' })
  async archive(
    @Param('restaurantId') restaurantId: string,
    @Param('mediaId') mediaId: string,
  ): Promise<void> {
    return this.mediaService.archiveMedia(restaurantId, mediaId);
  }
}

@ApiTags('media')
@Controller('restaurants/:restaurantId/products/:productId/image')
export class ProductImageController {
  constructor(private readonly mediaService: MediaService) {}

  @Patch(':mediaId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set product image' })
  @ApiResponse({ status: 200, description: 'Product image set' })
  async setImage(
    @Param('restaurantId') restaurantId: string,
    @Param('productId') productId: string,
    @Param('mediaId') mediaId: string,
  ): Promise<void> {
    return this.mediaService.setProductImage(restaurantId, productId, mediaId);
  }

  @Delete()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove product image' })
  @ApiResponse({ status: 200, description: 'Product image removed' })
  async removeImage(
    @Param('restaurantId') restaurantId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.mediaService.removeProductImage(restaurantId, productId);
  }
}
