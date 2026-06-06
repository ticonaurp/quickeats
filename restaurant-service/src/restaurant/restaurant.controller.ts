import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common'; // 👈 Cambiamos 'Put' por 'Patch'
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // POST: localhost:3003/restaurants
  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantService.create(dto);
  }

  // GET: localhost:3003/restaurants
  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  // GET: localhost:3003/restaurants/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }

  // 🛠️ Cambiado de @Put a @Patch para alinearse con el Gateway y el Frontend
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) { // 💡 Usamos 'any' o un DTO parcial para permitir cambios individuales
    return this.restaurantService.update(id, dto);
  }
}