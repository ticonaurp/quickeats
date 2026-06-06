import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common'; // 👈 Cambiamos 'Put' por 'Patch'
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  create(@Body() body: any) {
    return this.restaurantService.forwardRequest('/restaurants', 'POST', body);
  }

  @Get()
  findAll() {
    return this.restaurantService.forwardRequest('/restaurants', 'GET');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.forwardRequest(`/restaurants/${id}`, 'GET');
  }

  // 🛠️ Cambiado de @Put a @Patch para sincronizarse con el Frontend
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.restaurantService.forwardRequest(`/restaurants/${id}`, 'PATCH', body);
  }
}