import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { BranchProductsController } from './branch-products.controller.js';
import { BranchProductsService } from './branch-products.service.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [BranchProductsController],
  providers: [BranchProductsService],
})
export class BranchProductsModule {}
