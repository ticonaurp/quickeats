import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly httpService;
    private readonly authServiceUrl;
    constructor(httpService: HttpService);
    register(body: any): Promise<any>;
    login(body: any): Promise<any>;
    getProfile(token: string): Promise<any>;
}
