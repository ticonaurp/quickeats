import { Controller, Post, Put, Get, Body, Param, Delete, Query } from '@nestjs/common'; // 🟢 CORRECCIÓN 1: Importamos 'Query'
import { ProductService } from './product.service';

@Controller('products') 
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

  // 📋 4. Listar todos los productos (🟢 CORREGIDO 2: Captura el restaurantId de la URL y se lo pasa al servicio)
  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    return this.productService.findAll(restaurantId);
  }

  // ❌ 5. AGREGADO: Endpoint para recibir la orden de eliminación desde el Frontend
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}