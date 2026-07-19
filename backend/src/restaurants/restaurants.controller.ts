import {
  Body,
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
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { RestaurantsService } from './restaurants.service.js';
import { CreateRestaurantDto } from './dto/create-restaurant.dto.js';
import { RestaurantResponseDto } from './dto/restaurant-response.dto.js';
import { CreateBranchDto } from './dto/create-branch.dto.js';
import { BranchResponseDto } from './dto/branch-response.dto.js';
import { RestaurantMembershipGuard } from './guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from './guards/restaurant-role.guard.js';
import { RestaurantRoles } from './decorators/restaurant-roles.decorator.js';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created successfully' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return this.restaurantsService.create(user.sub, dto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List restaurants for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of user restaurants' })
  async list(
    @CurrentUser() user: { sub: string },
  ): Promise<RestaurantResponseDto[]> {
    return this.restaurantsService.listUserRestaurants(user.sub);
  }

  @Get(':restaurantId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Restaurant details' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async getOne(
    @CurrentUser() user: { sub: string },
    @Param('restaurantId') restaurantId: string,
  ): Promise<RestaurantResponseDto> {
    return this.restaurantsService.getOne(user.sub, restaurantId);
  }

  @Post(':restaurantId/branches')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a branch for a restaurant' })
  @ApiResponse({ status: 201, description: 'Branch created successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient role' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  async createBranch(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateBranchDto,
  ): Promise<BranchResponseDto> {
    return this.restaurantsService.createBranch(restaurantId, dto);
  }

  @Get(':restaurantId/branches')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List branches for a restaurant' })
  @ApiResponse({ status: 200, description: 'List of restaurant branches' })
  async listBranches(
    @Param('restaurantId') restaurantId: string,
  ): Promise<BranchResponseDto[]> {
    return this.restaurantsService.listBranches(restaurantId);
  }
}
