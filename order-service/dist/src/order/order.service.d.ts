import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';
export declare class OrderService {
    private readonly prisma;
    private readonly RESTAURANT_SERVICE_URL;
    constructor(prisma: PrismaService);
    create(createOrderDto: CreateOrderDto): Promise<{
        userId: string;
        productId: string;
        quantity: number;
        id: string;
        status: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        userId: string;
        productId: string;
        quantity: number;
        id: string;
        status: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        userId: string;
        productId: string;
        quantity: number;
        id: string;
        status: string;
        createdAt: Date;
    }>;
    updateStatus(id: string, updateOrderStatusDto: string): Promise<{
        userId: string;
        productId: string;
        quantity: number;
        id: string;
        status: string;
        createdAt: Date;
    }>;
}
export interface CreateOrderPayload {
    userId: string;
    productId: string;
    quantity: number;
}
export declare const createOrder: (payload: CreateOrderPayload) => Promise<any>;
