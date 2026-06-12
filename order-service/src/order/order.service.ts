import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrderService {
  // 🟢 Usamos el DNS interno de Docker (no localhost) para alcanzar al restaurant-service
  private readonly RESTAURANT_SERVICE_URL = `${process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:3003'}/products`;

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

    // 💾 3. Si existe, procedemos a crear la orden limpiamente
    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        productId: createOrderDto.productId,
        quantity: createOrderDto.quantity,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // 👤 Devuelve únicamente las órdenes que pertenecen al usuario indicado
  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    
    if (!order) {
      throw new NotFoundException(`La orden con ID ${id} no existe`);
    }
    
    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: string) {
  // Primero verificamos si la orden existe
  await this.findOne(id);

  return this.prisma.order.update({
    where: { id },
    data: { status: updateOrderStatusDto },
  });
}
}

export interface CreateOrderPayload {
  userId: string;
  productId: string;
  quantity: number;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  try {
    // 🎯 Apuntamos directo a tu API Gateway único
    const response = await fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Captura los errores 400 (validación) o 404 (producto inexistente) del backend
      throw new Error(data.message || 'Error al procesar el pedido');
    }

    return data; // Retorna el JSON con el id de la orden y estado "PENDING"
  } catch (error: any) {
    console.error('Error en checkout service:', error.message);
    throw error;
  }
};