import { PrismaService } from '../prisma/prisma.service';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(body: {
        name: string;
        description: string;
        price: number;
        restaurantId: string;
    }): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        price: number;
        imageUrl: string | null;
        restaurantId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
        price: number;
        imageUrl: string | null;
        restaurantId: string;
    }[]>;
}
