import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  // 1. Dejamos la definición perezosa para controlar el momento exacto de inicio
  private prisma!: PrismaClient;
  private pool!: Pool;

  async onModuleInit() {
    const dbUrl = process.env.DATABASE_URL || "postgresql://admin:admin123@localhost:5432/delivery_db?schema=public";

    // 2. Creamos un pool de conexiones nativo de PostgreSQL usando la URL
    this.pool = new Pool({ connectionString: dbUrl });
    
    // 3. Instanciamos el adaptador oficial que exige Prisma 7
    const adapter = new PrismaPg(this.pool);

    // 4. Inicializamos Prisma pasándole el adaptador requerido en el constructor
    this.prisma = new PrismaClient({ adapter });

    await this.prisma.$connect();
  }

  async createNotification(userId: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, message },
    });
  }

  async getNotificationsByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async onModuleDestroy() {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
    if (this.pool) {
      await this.pool.end();
    }
  }
}