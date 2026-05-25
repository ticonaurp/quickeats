import { PrismaService } from '../prisma/prisma.service';
export declare class RestaurantService {
    private prisma;
    constructor(prisma: PrismaService);
    create(body: {
        name: string;
        description: string;
    }): import("@prisma/client").Prisma.Prisma__RestaurantClient<{
        id: string;
        name: string;
        description: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        products: {
            id: string;
            name: string;
            description: string;
            createdAt: Date;
            price: number;
            imageUrl: string | null;
            restaurantId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string;
        createdAt: Date;
    })[]>;
}
