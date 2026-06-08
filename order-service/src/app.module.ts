import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [OrderModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}