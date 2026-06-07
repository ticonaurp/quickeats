import { Controller, Post, Put, Body, Param, Get, Delete } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products') 
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 🚀 1. Crear producto
  @Post()
  async create(@Body() createProductDto: any) {
    return this.productService.create(createProductDto);
  }

  // 📋 2. Listar todos los productos (Para la tabla general del Front)
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  // 🔍 3. Buscar un producto por ID (Para cargar los datos en la pantalla de Editar)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // 🔄 4. Actualizar producto
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productService.update(id, updateProductDto);
  }

  // ❌ 5. AGREGADO: Eliminar producto por ID (Para activar tu DeleteModal real)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}