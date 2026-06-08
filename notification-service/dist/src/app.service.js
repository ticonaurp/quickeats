"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let AppService = class AppService {
    prisma;
    pool;
    async onModuleInit() {
        const dbUrl = process.env.DATABASE_URL || "postgresql://admin:admin123@localhost:5432/delivery_db?schema=public";
        this.pool = new pg_1.Pool({ connectionString: dbUrl });
        const adapter = new adapter_pg_1.PrismaPg(this.pool);
        this.prisma = new client_1.PrismaClient({ adapter });
        await this.prisma.$connect();
    }
    async createNotification(userId, message) {
        return this.prisma.notification.create({
            data: { userId, message },
        });
    }
    async getNotificationsByUser(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async onModuleDestroy() {
        if (this.prisma) {
            await this.prisma.$disconnect();
        }
        if (this.pool) {
            await this.pool.end();
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map