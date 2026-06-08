import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
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
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        userId: string;
        productId: string;
        quantity: number;
        id: string;
        status: string;
        createdAt: Date;
    }>;
}
