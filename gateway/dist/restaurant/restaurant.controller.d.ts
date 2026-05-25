import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    createRestaurant(body: any): Promise<any>;
    findAllRestaurants(): Promise<any>;
    createProduct(body: any): Promise<any>;
    findAllProducts(): Promise<any>;
}
