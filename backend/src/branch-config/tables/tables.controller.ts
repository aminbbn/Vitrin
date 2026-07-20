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
import { AccessTokenGuard } from '../../auth/guards/access-token.guard.js';
import { RestaurantMembershipGuard } from '../../restaurants/guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from '../../restaurants/guards/restaurant-role.guard.js';
import { RestaurantRoles } from '../../restaurants/decorators/restaurant-roles.decorator.js';
import { TablesService } from './tables.service.js';
import { CreateTableDto } from './dto/create-table.dto.js';
import { UpdateTableDto } from './dto/update-table.dto.js';
import { TableResponseDto } from './dto/table-response.dto.js';

@ApiTags('branch-tables')
@Controller('restaurants/:restaurantId/branches/:branchId/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List branch tables' })
  @ApiResponse({ status: 200, description: 'List of tables' })
  async list(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
  ): Promise<TableResponseDto[]> {
    return this.tablesService.list(restaurantId, branchId);
  }

  @Post()
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a table' })
  @ApiResponse({ status: 201, description: 'Table created' })
  async create(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Body() dto: CreateTableDto,
  ): Promise<TableResponseDto> {
    return this.tablesService.create(restaurantId, branchId, dto);
  }

  @Patch(':tableId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a table' })
  @ApiResponse({ status: 200, description: 'Table updated' })
  async update(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('tableId') tableId: string,
    @Body() dto: UpdateTableDto,
  ): Promise<TableResponseDto> {
    return this.tablesService.update(restaurantId, branchId, tableId, dto);
  }

  @Delete(':tableId')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a table' })
  @ApiResponse({ status: 200, description: 'Table deleted' })
  async remove(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('tableId') tableId: string,
  ): Promise<void> {
    return this.tablesService.remove(restaurantId, branchId, tableId);
  }
}
