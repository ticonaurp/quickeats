import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // 🟢 En Docker se inyecta RESTAURANT_SERVICE_URL; en local cae a localhost.
  private readonly restaurantServiceUrl =
    process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3003';

  // 🛡️ Barrera de última línea: sin importar qué mande el cliente (frontend, chatbot, Postman),
  // nunca se crea una orden para un restaurante cerrado.
  private async assertRestaurantIsOpen(restaurantId: string) {
    let restaurant: { name?: string; isOpen?: boolean };

    try {
      const response = await fetch(`${this.restaurantServiceUrl}/restaurants/${restaurantId}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.status === 404) {
        throw new NotFoundException('El restaurante de este pedido ya no existe.');
      }
      if (!response.ok) {
        throw new Error(`restaurant-service respondió ${response.status}`);
      }
      restaurant = await response.json();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('assertRestaurantIsOpen: fallo verificando restaurante', restaurantId, error);
      throw new BadRequestException('No se pudo verificar el estado del restaurante. Intenta de nuevo.');
    }

    if (restaurant.isOpen === false) {
      throw new BadRequestException(
        `${restaurant.name ?? 'Este restaurante'} está cerrado en este momento y no puede recibir pedidos.`,
      );
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    await this.assertRestaurantIsOpen(createOrderDto.restaurantId);

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