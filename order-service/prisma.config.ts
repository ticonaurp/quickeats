import * as dotenv from 'dotenv';
dotenv.config(); // Carga las variables del .env para la CLI de Prisma 7

import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});