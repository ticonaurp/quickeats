import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [HttpModule], // Permite usar peticiones HTTP salientes
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}