import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: any): Promise<any>;
    login(body: any): Promise<any>;
    getProfile(authHeader: string): Promise<any>;
}
