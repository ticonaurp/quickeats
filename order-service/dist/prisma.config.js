"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
const config = {
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
exports.default = (0, config_1.defineConfig)(config);
//# sourceMappingURL=prisma.config.js.map