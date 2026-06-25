import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; 
import { Pool } from 'pg'; 
import { PrismaPg } from '@prisma/adapter-pg'; 
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  //  Mantenemos tu propiedad por si otros archivos del microservicio la usan de puente
  public client = this;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    // Calculamos la ruta absoluta interna del contenedor para el certificado
    const containerCertPath = '/app/supabase-ca.crt';
    const localCertPath = path.join(process.cwd(), 'supabase-ca.crt');
    const certPath = fs.existsSync(containerCertPath) ? containerCertPath : localCertPath;

    // Configuramos el objeto SSL para el Pool nativo de Node-Postgres
    // ⚠️ El pooler de Supabase presenta un certificado self-signed en su cadena.
    // Con sslmode=require basta CIFRAR la conexión sin validar la CA (evita P1011 TlsConnectionError).
    const sslConfig = fs.existsSync(certPath)
      ? {
          rejectUnauthorized: false,
          ca: fs.readFileSync(certPath, 'utf8'),
        }
      : { rejectUnauthorized: false };

    const pool = new Pool({ 
      connectionString,
      ssl: sslConfig //  Inyección crucial de TLS
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect(); 
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}