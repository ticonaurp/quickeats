import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ProductModule } from './product/product.module'; // 👈 Tu importación
import { OrderModule } from './order/order.module'; // 👈 Importación de tu compañero
import { NotificationModule } from './notification/notification.module'; // 👈 Importación de tu compañero
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    RestaurantModule,
    ProductModule, // 👈 Tus productos registrados
    OrderModule, // 👈 Sus órdenes registradas
    NotificationModule, // 👈 Sus notificaciones registradas
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}