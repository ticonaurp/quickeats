import * as dotenv from 'dotenv';
import * as path from 'path';

//  Forzamos la carga del .env local en el proceso de Node
dotenv.config({ path: path.resolve(__dirname, '.env') });

const config: any = {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // 👈 Por defecto, usa el pooler para NestJS
  },
};

// Si ejecutamos comandos de consola de Prisma, inyectamos la DIRECT_URL automáticamente
if (process.argv.some(arg => arg.includes('prisma') || arg.includes('db') || arg.includes('push'))) {
  config.datasource.url = process.env.DIRECT_URL;
}

export default config;