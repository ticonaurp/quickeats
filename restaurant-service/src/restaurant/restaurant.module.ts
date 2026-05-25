import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // <-- Conectado a la DB
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}