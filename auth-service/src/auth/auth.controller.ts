import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common'; // <-- Añadir Get, UseGuards, Request
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard'; // <-- Importar tu Guard

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile') // <-- Nuevo endpoint protegido
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    // Retorna la información extraída del token que guardó la estrategia
    return {
      message: 'Tienes acceso al perfil protegido',
      user: req.user,
    };
  }
}