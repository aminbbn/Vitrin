import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { MenuDraftController } from './menu-draft.controller.js';
import { MenuDraftService } from './menu-draft.service.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [MenuDraftController],
  providers: [MenuDraftService],
})
export class MenuModule {}
