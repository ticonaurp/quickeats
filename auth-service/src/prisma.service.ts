import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkgPg from 'pg'; 

const { Pool } = pkgPg;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    // 1. Extraemos el esquema dinámicamente de la URL limpia
    let schema = 'public';
    if (connectionString) {
      try {
        const url = new URL(connectionString);
        schema = url.searchParams.get('schema') || 'public';
      } catch (error) {
        schema = 'public';
      }
    }

    // 2. Creamos el pool inyectando el search_path de Supabase
    const pool = new Pool({ 
      connectionString,
      options: `-c search_path=${schema}`
    });
    
    const adapter = new PrismaPg(pool);
    
    // 3. Pasamos el adapter obligatorio exigido por Prisma 7
    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}