import { Controller, Post, Put, Body, Param, Get, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products') 
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 🚀 1. Crear producto
  @Post()
  async create(@Body() createProductDto: any) {
    return this.productService.create(createProductDto);
  }

  // 📋 2. Listar productos (🟢 CORREGIDO: Ahora filtra por restaurante si viene en la URL)
  @Get()
  async findAll(@Query('restaurantId') restaurantId?: string) {
    return this.productService.findAll(restaurantId);
  }

  // 🔍 3. Buscar un producto por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // 🔄 4. Actualizar producto
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productService.update(id, updateProductDto);
  }

  // ❌ 5. Eliminar producto por ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}