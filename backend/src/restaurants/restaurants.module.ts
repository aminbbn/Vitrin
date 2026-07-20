import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantMembershipGuard } from './guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from './guards/restaurant-role.guard.js';
import { PermissionsController } from './permissions/permissions.controller.js';
import { PermissionsService } from './permissions/permissions.service.js';

@Module({
  controllers: [RestaurantsController, PermissionsController],
  providers: [
    RestaurantsService,
    RestaurantMembershipGuard,
    RestaurantRoleGuard,
    PermissionsService,
  ],
  exports: [RestaurantMembershipGuard, RestaurantRoleGuard],
})
export class RestaurantsModule {}
