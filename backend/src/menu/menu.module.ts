import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { MenuDraftController } from './menu-draft.controller.js';
import { MenuDraftService } from './menu-draft.service.js';
import { MenuPublicationController } from './publication/menu-publication.controller.js';
import { MenuPublicationService } from './publication/menu-publication.service.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [MenuDraftController, MenuPublicationController],
  providers: [MenuDraftService, MenuPublicationService],
})
export class MenuModule {}
