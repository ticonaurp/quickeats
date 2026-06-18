/// <reference types="node" />
// @ts-ignore
import "dotenv/config";
// @ts-ignore
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

if (process.argv.some((arg: string) => arg.includes('prisma') || arg.includes('db') || arg.includes('push'))) {
  config.datasource.url = process.env["DIRECT_URL"];
}

// @ts-ignore
export default defineConfig ? defineConfig(config) : config;