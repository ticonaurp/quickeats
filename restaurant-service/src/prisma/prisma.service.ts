import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; // <-- Importamos el pool nativo de Postgres
import { PrismaPg } from '@prisma/adapter-pg'; // <-- El adaptador oficial de Prisma 7
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Creamos el pool de conexiones de 'pg' leyendo tu .env
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Inicializamos el adaptador de Prisma 7
    const adapter = new PrismaPg(pool);

    // 3. Se lo inyectamos al constructor mediante super()
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}