import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkgPg from 'pg'; // 🔑 Importación segura para mitigar problemas de interoperabilidad ESM/CJS en pg

const { Pool } = pkgPg;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Configurar el pool de conexión nativo de Postgres para Prisma v7
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    
    // Pasar el adaptador al constructor de PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    // Mantener el cast 'as any' es una excelente práctica aquí, ya que bajo nodenext 
    // TypeScript a veces no mapea el prototipo extendido de los métodos de Prisma v7 al instante
    await (this as any).$connect();
  }
}