import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;

    const order = await this.prisma.order.create({
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

    await this.notifyOrderCreated(order.userId);

    return order;
  }

  // 🔔 Avisa al notification-service que la orden se creó. No debe romper el flujo de creación si falla.
  // En Docker se inyecta NOTIFICATION_SERVICE_URL (DNS del contenedor); en local cae a localhost.
  private readonly notificationUrl =
    process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';

  private async notifyOrderCreated(userId: string) {
    try {
      await fetch(`${this.notificationUrl}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: 'Tu orden ha sido creada exitosamente',
        }),
      });
    } catch (error) {
      console.error('No se pudo notificar la creación de la orden:', error);
    }
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
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: true,
        },
      });
    } catch (error: any) {
      // 💡 Al asignarle de forma explícita ': any' al catch (o haciendo un cast),
      // TypeScript te permite leer '.code' sin arrojar la alerta de 'unknown'
      if (error?.code === 'P2025') {
        throw new NotFoundException('La orden que intentas actualizar no existe.');
      }
      throw error;
    }
  }
}