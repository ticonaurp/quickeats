import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module'; // 👈 1. Importa tu nuevo módulo

@Module({
  imports: [
    AuthModule, 
    RestaurantModule // 👈 2. Agrégalo aquí junto a los demás módulos
  ], 
  controllers: [],
  providers: [],
})
export class AppModule {}