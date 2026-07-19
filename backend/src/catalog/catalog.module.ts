import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { CategoriesController } from './categories/categories.controller.js';
import { CategoriesService } from './categories/categories.service.js';
import { ProductsController } from './products/products.controller.js';
import { ProductsService } from './products/products.service.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [CategoriesController, ProductsController],
  providers: [CategoriesService, ProductsService],
})
export class CatalogModule {}
