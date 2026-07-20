import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
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
import { WorkingHoursService } from './working-hours.service.js';
import { UpsertWorkingHoursDto } from './dto/upsert-working-hours.dto.js';
import { CreateSpecialHoursDto } from './dto/create-special-hours.dto.js';
import { WorkingIntervalResponseDto } from './dto/working-hours-response.dto.js';
import { SpecialHoursResponseDto } from './dto/special-hours-response.dto.js';

@ApiTags('branch-working-hours')
@Controller('restaurants/:restaurantId/branches/:branchId')
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  @Get('working-hours')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List branch working hours' })
  async listWorkingHours(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
  ): Promise<WorkingIntervalResponseDto[]> {
    return this.workingHoursService.listWorkingHours(restaurantId, branchId);
  }

  @Put('working-hours')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Replace all branch working hours' })
  async upsertWorkingHours(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Body() dto: UpsertWorkingHoursDto,
  ): Promise<WorkingIntervalResponseDto[]> {
    return this.workingHoursService.upsertWorkingHours(restaurantId, branchId, dto);
  }

  @Get('special-hours')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List branch special hours' })
  async listSpecialHours(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
  ): Promise<SpecialHoursResponseDto[]> {
    return this.workingHoursService.listSpecialHours(restaurantId, branchId);
  }

  @Post('special-hours')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update special hours' })
  async upsertSpecialHours(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Body() dto: CreateSpecialHoursDto,
  ): Promise<SpecialHoursResponseDto> {
    return this.workingHoursService.upsertSpecialHours(restaurantId, branchId, dto);
  }

  @Delete('special-hours/:date')
  @UseGuards(AccessTokenGuard, RestaurantMembershipGuard, RestaurantRoleGuard)
  @RestaurantRoles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove special hours for a date' })
  async removeSpecialHours(
    @Param('restaurantId') restaurantId: string,
    @Param('branchId') branchId: string,
    @Param('date') date: string,
  ): Promise<void> {
    return this.workingHoursService.removeSpecialHours(restaurantId, branchId, date);
  }
}
