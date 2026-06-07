import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Importamos tu módulo de Prisma

@Module({
  imports: [PrismaModule], // Asegura que PrismaService esté accesible aquí
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}