import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        role: import("@prisma/client").$Enums.Role;
        name: string;
        message: string;
    }>;
    getProfile(req: any): {
        message: string;
        user: any;
    };
}
