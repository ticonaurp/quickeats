import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
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
