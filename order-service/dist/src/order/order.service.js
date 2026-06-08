"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OrderService = class OrderService {
    prisma;
    RESTAURANT_SERVICE_URL = 'http://localhost:3003/products';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto) {
        try {
            const response = await fetch(this.RESTAURANT_SERVICE_URL);
            if (!response.ok)
                throw new Error();
            const products = await response.json();
            const productExists = products.some((p) => p.id === createOrderDto.productId);
            if (!productExists) {
                throw new common_1.NotFoundException(`El producto con ID '${createOrderDto.productId}' no existe en el catálogo de restaurantes.`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException('No se pudo verificar el producto porque el servicio de restaurantes no está disponible.');
        }
        return this.prisma.order.create({
            data: {
                userId: createOrderDto.userId,
                productId: createOrderDto.productId,
                quantity: createOrderDto.quantity,
            },
        });
    }
    async findAll() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException(`La orden con ID ${id} no existe`);
        }
        return order;
    }
    async updateStatus(id, updateOrderStatusDto) {
        await this.findOne(id);
        return this.prisma.order.update({
            where: { id },
            data: { status: updateOrderStatusDto },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
const createOrder = async (payload) => {
    try {
        const response = await fetch('http://localhost:3001/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Error al procesar el pedido');
        }
        return data;
    }
    catch (error) {
        console.error('Error en checkout service:', error.message);
        throw error;
    }
};
exports.createOrder = createOrder;
//# sourceMappingURL=order.service.js.map