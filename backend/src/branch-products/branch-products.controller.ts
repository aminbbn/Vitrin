import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { BranchProductsService } from './branch-products.service.js';
import { UpsertBranchProductDto } from './dto/upsert-branch-product.dto.js';
import { UpdateBranchProductDto } from './dto/update-branch-product.dto.js';
import { BranchProductResponseDto } from './dto/branch-product-response.dto.js';
import { BranchCatalogProductResponseDto } from './dto/branch-catalog-product-response.dto.js';

@ApiTags('branch-products')
@Controller('restaurants/:restaurantId/branches/:branchId/products')
export class BranchProductsController {
  constructor(private readonly branchProductsService: BranchProductsService) {}

  @Get()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List branch catalog products' })
  @ApiResponse({ status: 200, description: 'List of catalog products with branch configuration' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Restaurant or branch not found' })
  async list(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
  ): Promise<BranchCatalogProductResponseDto[]> {
    return this.branchProductsService.listCatalogProducts(restaurantId, branchId);
  }

  @Put(':productId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or replace branch product configuration' })
  @ApiResponse({ status: 200, description: 'Branch product upserted' })
  @ApiResponse({ status: 400, description: 'Invalid discount price' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Restaurant, branch, or product not found' })
  async upsert(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('productId') productId: string,
    @Body() dto: UpsertBranchProductDto,
  ): Promise<BranchProductResponseDto> {
    return this.branchProductsService.upsertBranchProduct(
      restaurantId,
      branchId,
      productId,
      dto,
    );
  }

  @Patch(':productId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Partially update branch product configuration' })
  @ApiResponse({ status: 200, description: 'Branch product updated' })
  @ApiResponse({ status: 400, description: 'Invalid discount price' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Restaurant, branch, product, or branch product not found' })
  async update(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateBranchProductDto,
  ): Promise<BranchProductResponseDto> {
    return this.branchProductsService.updateBranchProduct(
      restaurantId,
      branchId,
      productId,
      dto,
    );
  }
}
