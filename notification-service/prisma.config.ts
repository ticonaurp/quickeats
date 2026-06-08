import * as dotenv from 'dotenv';
import * as path from 'path';

// 🔥 Forzamos la carga del .env local en el proceso de Node
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL, // 👈 Aquí se inyecta la URL de Postgres
  },
};