import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  // 🌐 CLAVE DE BACKEND: Redirige al contenedor de restaurantes en Render usando su URL pública
  private readonly RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL
    ? `${process.env.RESTAURANT_SERVICE_URL}/products`
    : 'http://localhost:3003/products'; 

  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      // 🔍 1. Traemos la lista completa de productos desde restaurant-service
      const response = await fetch(this.RESTAURANT_SERVICE_URL);
      if (!response.ok) throw new Error();

      const products = await response.json();
      
      // 🕵️‍♂️ 2. Verificamos si el ID enviado existe dentro del array de productos
      const productExists = products.some((p: any) => p.id === createOrderDto.productId);

      if (!productExists) {
        throw new NotFoundException(`El producto con ID '${createOrderDto.productId}' no existe en el catálogo de restaurantes.`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('No se pudo verificar el producto porque el servicio de restaurantes no está disponible.');
    }

    // 💾 3. SIMULACIÓN TEMPORAL: Como el modelo "order" no existe en Prisma, 
    // devolvemos un objeto simulado para salvar el "npm run build" en Render.
    return {
      id: "mock-order-uuid",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      userId: createOrderDto.userId,
      productId: createOrderDto.productId,
      quantity: createOrderDto.quantity,
    };

    /* // Descomentar cuando el modelo "order" esté agregado en schema.prisma:
    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        productId: createOrderDto.productId,
        quantity: createOrderDto.quantity,
      },
    });
    */
  }

  async findAll() {
    // Devuelve un array vacío provisional para no romper la firma del método con Prisma
    return [];
    /*
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    */
  }

  async findOne(id: string) {
    throw new NotFoundException(`La orden con ID ${id} no existe (Modo provisional)`);
    /*
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) throw new NotFoundException(`La orden con ID ${id} no existe`);
    return order;
    */
  }

  async updateStatus(id: string, updateOrderStatusDto: string) {
    return { id, status: updateOrderStatusDto };
  }
}