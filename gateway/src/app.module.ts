import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ProductModule } from './product/product.module'; // 👈 Tu importación

@Module({
  imports: [
    HttpModule,
    AuthModule,
    RestaurantModule,
    ProductModule, // 👈 Registrado aquí
  ],
})
export class AppModule {}