import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        createdAt: Date;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        message: string;
    }>;
    getProfile(req: any): {
        message: string;
        user: any;
    };
}
