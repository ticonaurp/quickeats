import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  // Inyectamos el servicio de Prisma para interactuar con la BD de Docker
  constructor(private prisma: PrismaService) {}

  // 1. Crear un restaurante
  async create(dto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: dto,
    });
  }

  // 2. Listar todos (para tu tabla del panel de administración)
  async findAll() {
    return this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Buscar uno solo por ID (esencial para cargar los datos en modo edición)
  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException(`El restaurante con ID ${id} no existe.`);
    }
    return restaurant;
  }

  // 4. Modificar y guardar cambios (para el botón Guardar Cambios)
  async update(id: string, dto: CreateRestaurantDto) {
    await this.findOne(id); // Si no existe, findOne lanza el error automáticamente
    return this.prisma.restaurant.update({
      where: { id },
      data: dto,
    });
  }
}