import { type Response } from 'express';
export declare class OrderController {
    private readonly ORDER_SERVICE_URL;
    createOrder(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findAllOrders(res: Response): Promise<Response<any, Record<string, any>>>;
    findOneOrder(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
