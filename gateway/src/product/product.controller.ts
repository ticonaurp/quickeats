import { Controller, Post, Put, Get, Body, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products') // Expone la ruta: http://localhost:4000/products
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 🚀 1. Crear producto
  @Post()
  create(@Body() body: any) {
    return this.productService.create(body);
  }

  // 🔍 2. Buscar un producto por ID (Para cargar los datos en la pantalla de Editar)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  // 🔄 3. Actualizar producto
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.productService.update(id, body);
  }

  // 📋 4. Listar todos los productos (Para la grilla del panel de administración)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // ❌ 5. AGREGADO: Endpoint para recibir la orden de eliminación desde el Frontend
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}