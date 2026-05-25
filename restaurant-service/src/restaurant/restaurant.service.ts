import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  // 💡 Define el método 'create' que pide tu controlador
  create(body: { name: string; description: string }) {
    return this.prisma.restaurant.create({ data: body });
  }

  // 💡 Define el método 'findAll' que pide tu controlador
  findAll() {
    return this.prisma.restaurant.findMany({ include: { products: true } });
  }
}