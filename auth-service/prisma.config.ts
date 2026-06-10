import "dotenv/config";
import { defineConfig } from "prisma/config";

// Usamos un casteo "as any" para saltarnos el validador estricto de tipos de Prisma 7
const config: any = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  }
};

// Si estamos ejecutando un comando de consola (como db push), inyectamos la DIRECT_URL en la configuración
if (process.argv.some(arg => arg.includes('prisma') || arg.includes('db') || arg.includes('push'))) {
  config.datasource.url = process.env["DIRECT_URL"];
}

export default defineConfig(config);