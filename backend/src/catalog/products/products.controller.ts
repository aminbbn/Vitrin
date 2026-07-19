import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard.js';
import { RestaurantMembershipGuard } from '../../restaurants/guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from '../../restaurants/guards/restaurant-role.guard.js';
import { RestaurantRoles } from '../../restaurants/decorators/restaurant-roles.decorator.js';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductResponseDto } from './dto/product-response.dto.js';

@ApiTags('catalog')
@Controller('restaurants/:restaurantId/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Restaurant or category not found' })
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(restaurantId, dto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List products for a restaurant' })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of products' })
  async list(
    @Param('restaurantId') restaurantId: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.list(restaurantId, categoryId);
  }

  @Get(':productId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product details' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getOne(
    @Param('restaurantId') restaurantId: string,
    @Param('productId') productId: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.getOne(restaurantId, productId);
  }

  @Patch(':productId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('restaurantId') restaurantId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(restaurantId, productId, dto);
  }

  @Delete(':productId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(
    @Param('restaurantId') restaurantId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.productsService.remove(restaurantId, productId);
  }
}
