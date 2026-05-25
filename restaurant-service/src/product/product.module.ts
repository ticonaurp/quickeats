import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Importación limpia

@Module({
  imports: [PrismaModule], // <-- Agregado aquí para habilitar Prisma
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}