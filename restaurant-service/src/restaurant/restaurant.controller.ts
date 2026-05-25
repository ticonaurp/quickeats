import { Controller, Get, Post, Body } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  create(@Body() body: { name: string; description: string }) {
    return this.restaurantService.create(body);
  }

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }
}