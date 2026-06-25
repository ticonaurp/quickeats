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
    // ⚠️ El pooler de Supabase presenta un certificado self-signed en su cadena.
    // Con sslmode=require basta CIFRAR la conexión sin validar la CA; validar estricto
    // provoca P1011 "self-signed certificate in certificate chain" y rompe todas las queries.
    const sslConfig = fs.existsSync(certPath)
      ? {
          rejectUnauthorized: false,
          ca: fs.readFileSync(certPath, 'utf8'),
        }
      : { rejectUnauthorized: false }; // Siempre TLS (Supabase exige sslmode=require)

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