import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkgPg from 'pg'; 
import * as fs from 'fs';   // 🌟 NUEVO
import * as path from 'path'; // 🌟 NUEVO

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

    // 🌟 MODIFICACIÓN: Forzamos la ruta absoluta de Docker (/app/) con fallback local
    const containerCertPath = '/app/supabase-ca.crt';
    const localCertPath = path.join(process.cwd(), 'supabase-ca.crt');
    
    // Si existe en el contenedor, usa esa; si no, usa la ruta local
    const certPath = fs.existsSync(containerCertPath) ? containerCertPath : localCertPath;

    // ⚠️ El pooler de Supabase presenta un certificado self-signed en su cadena.
    // Con sslmode=require basta CIFRAR la conexión sin validar la CA; validar estricto
    // provoca P1011 "self-signed certificate in certificate chain" y rompe todas las queries.
    const sslConfig = fs.existsSync(certPath)
      ? {
          rejectUnauthorized: false,
          ca: fs.readFileSync(certPath, 'utf8'),
        }
      : { rejectUnauthorized: false }; // Siempre TLS (Supabase exige sslmode=require)

    // 🔬 LOG DE CONTROL: Esto te dirá en la terminal si Docker encontró el archivo con éxito
    console.log(`[Prisma SSL Auth] ¿Certificado encontrado?: ${fs.existsSync(certPath)}. Ruta: ${certPath}`);

    // 2. Creamos el pool inyectando el search_path de Supabase y el SSL
    const pool = new Pool({ 
      connectionString,
      options: `-c search_path=${schema}`,
      ssl: sslConfig // 🌟 NUEVO: Inyectamos la seguridad TLS
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