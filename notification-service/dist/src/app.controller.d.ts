import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createNotification(body: {
        userId: string;
        message: string;
    }): Promise<{
        id: string;
        userId: string;
        message: string;
        createdAt: Date;
    }>;
    getNotifications(userId: string): Promise<{
        id: string;
        userId: string;
        message: string;
        createdAt: Date;
    }[]>;
}
