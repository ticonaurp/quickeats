import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // 🚀 1. Crear un producto
  async create(data: any) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price), 
        category: data.category,
        calories: data.calories ? parseInt(data.calories, 10) : null, 
        image: data.image,
        isAvailable: data.isAvailable ?? true,
        isPopular: data.isPopular ?? false,
        restaurantId: data.restaurantId,
      },
    });
  }

  // 📋 2. Obtener todos los productos (🟢 CORREGIDO: Ahora acepta el filtro relacional)
  async findAll(restaurantId?: string) {
    return this.prisma.product.findMany({
      // Si viene restaurantId, filtra por ese restaurante; si no, trae todos de forma global
      where: restaurantId ? { restaurantId: restaurantId } : {},
      orderBy: { createdAt: 'desc' }, // Trae los más recientes primero
    });
  }

  // 🔍 3. Obtener un producto único por ID
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    // Control de QA: Si el UUID no existe, lanzamos un error 404 limpio
    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  // 🔄 4. Actualizar un producto existente
  async update(id: string, data: any) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description || null,
          price: data.price ? parseFloat(data.price) : undefined,
          category: data.category,
          calories: data.calories ? parseInt(data.calories, 10) : null,
          image: data.image,
          isAvailable: data.isAvailable,
          isPopular: data.isPopular,
          restaurantId: data.restaurantId,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Error al actualizar: El producto ${id} no existe`);
    }
  }

  // ❌ 5. Eliminar un producto físicamente de PostgreSQL mediante Prisma
  async remove(id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Error al eliminar: El producto con ID ${id} no existe en el sistema`);
    }
  }
}