import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsService } from './restaurants.service.js';
import { RestaurantMembershipGuard } from './guards/restaurant-membership.guard.js';
import { RestaurantRoleGuard } from './guards/restaurant-role.guard.js';

@Module({
  controllers: [RestaurantsController],
  providers: [
    RestaurantsService,
    RestaurantMembershipGuard,
    RestaurantRoleGuard,
  ],
  exports: [RestaurantMembershipGuard, RestaurantRoleGuard],
})
export class RestaurantsModule {}
