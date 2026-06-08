import { type Response } from 'express';
export declare class NotificationController {
    private readonly NOTIFICATION_SERVICE_URL;
    createNotification(body: any, res: Response): Promise<Response<any, Record<string, any>>>;
    findNotificationsByUser(userId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
