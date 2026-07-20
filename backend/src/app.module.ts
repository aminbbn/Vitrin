import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BranchConfigModule } from './branch-config/branch-config.module.js';
import { BranchProductsModule } from './branch-products/branch-products.module.js';
import { CatalogModule } from './catalog/catalog.module';
import { HealthModule } from './health/health.module';
import { MenuModule } from './menu/menu.module.js';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    RestaurantsModule,
    CatalogModule,
    BranchProductsModule,
    BranchConfigModule,
    MenuModule,
  ],
})
export class AppModule {}
