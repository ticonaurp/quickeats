import { Controller, Get, Post, Body } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller() // 💡 Lo dejamos vacío para que use directamente las rutas de los métodos
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // 🍔 Endpoints de Restaurantes
  @Post('restaurants')
  createRestaurant(@Body() body: any) {
    return this.restaurantService.forwardRequest('/restaurants', 'POST', body);
  }

  @Get('restaurants')
  findAllRestaurants() {
    return this.restaurantService.forwardRequest('/restaurants', 'GET');
  }

  // 🍕 Endpoints de Productos
  @Post('products')
  createProduct(@Body() body: any) {
    return this.restaurantService.forwardRequest('/products', 'POST', body);
  }

  @Get('products')
  findAllProducts() {
    return this.restaurantService.forwardRequest('/products', 'GET');
  }
}