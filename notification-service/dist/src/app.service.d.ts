import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class AppService implements OnModuleInit, OnModuleDestroy {
    private prisma;
    private pool;
    onModuleInit(): Promise<void>;
    createNotification(userId: string, message: string): Promise<{
        id: string;
        userId: string;
        message: string;
        createdAt: Date;
    }>;
    getNotificationsByUser(userId: string): Promise<{
        id: string;
        userId: string;
        message: string;
        createdAt: Date;
    }[]>;
    onModuleDestroy(): Promise<void>;
}
