import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;

    return this.prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 👤 NUEVO: Busca todas las órdenes históricas pertenecientes a un usuario
  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true, // Trae el detalle de qué compró en cada orden
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
    if (!order) throw new NotFoundException('La orden solicitada no existe.');
    return order;
  }

  // 🔄 NUEVO: Actualiza el estado de la orden (PENDING -> PREPARING, etc.)
  async updateStatus(id: string, status: string) {
    // Verificamos primero si existe la orden
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });
  }
}