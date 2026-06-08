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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
let OrderController = class OrderController {
    ORDER_SERVICE_URL = 'http://localhost:3004/orders';
    async createOrder(body, res) {
        try {
            const response = await fetch(this.ORDER_SERVICE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return res.status(response.status).json(data);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_GATEWAY).json({
                message: 'No se pudo conectar con el microservicio de órdenes.',
            });
        }
    }
    async findAllOrders(res) {
        try {
            const response = await fetch(this.ORDER_SERVICE_URL);
            const data = await response.json();
            return res.status(response.status).json(data);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_GATEWAY).json({
                message: 'No se pudo conectar con el microservicio de órdenes.',
            });
        }
    }
    async findOneOrder(id, res) {
        try {
            const response = await fetch(`${this.ORDER_SERVICE_URL}/${id}`);
            const data = await response.json();
            return res.status(response.status).json(data);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.BAD_GATEWAY).json({
                message: 'No se pudo conectar con el microservicio de órdenes.',
            });
        }
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAllOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findOneOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders')
], OrderController);
//# sourceMappingURL=order.controller.js.map