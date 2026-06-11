import "dotenv/config";
import { defineConfig } from "prisma/config";

const config: any = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  }
};

if (process.argv.some(arg => arg.includes('prisma') || arg.includes('db') || arg.includes('push'))) {
  config.datasource.url = process.env["DIRECT_URL"];
}

export default defineConfig(config);