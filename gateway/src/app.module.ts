import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module'; 

@Module({
  imports: [AuthModule, RestaurantModule, OrderModule, NotificationModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}