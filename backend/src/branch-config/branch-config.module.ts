import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { TablesController } from './tables/tables.controller.js';
import { TablesService } from './tables/tables.service.js';
import { WorkingHoursController } from './working-hours/working-hours.controller.js';
import { WorkingHoursService } from './working-hours/working-hours.service.js';
import { QrTokensController } from './qr-tokens/qr-tokens.controller.js';
import { QrTokensService } from './qr-tokens/qr-tokens.service.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [
    TablesController,
    WorkingHoursController,
    QrTokensController,
  ],
  providers: [TablesService, WorkingHoursService, QrTokensService],
})
export class BranchConfigModule {}
