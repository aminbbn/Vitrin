import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { MediaController, ProductImageController } from './media.controller.js';
import { MediaService } from './media.service.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [MediaController, ProductImageController],
  providers: [MediaService],
})
export class MediaModule {}
