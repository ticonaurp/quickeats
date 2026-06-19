import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; 
import { Pool } from 'pg'; 
import { PrismaPg } from '@prisma/adapter-pg'; 
import * as fs from 'fs';     // 🌟 NUEVO
import * as path from 'path'; // 🌟 NUEVO
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    // 🌟 NUEVO: Mapeo seguro del certificado para evitar el TlsConnectionError
    const certPath = path.join(process.cwd(), 'supabase-ca.crt');
    const sslConfig = fs.existsSync(certPath)
      ? {
          rejectUnauthorized: true, // 🛡️ Validación estricta activada
          ca: fs.readFileSync(certPath, 'utf8'),
        }
      : false; // Fallback por si en algún entorno local no usan SSL

    // Creamos el pool inyectando el objeto de configuración SSL
    const pool = new Pool({ 
      connectionString,
      ssl: sslConfig // 🌟 NUEVO: Se lo pasamos al driver nativo 'pg'
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect(); 
  }
}