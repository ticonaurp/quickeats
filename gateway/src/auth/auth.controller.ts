import { Controller, Post, Body, Get, Headers } from '@nestjs/common'; // <-- Añade Get y Headers
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get('profile') // <-- Nuevo puente para el perfil
  getProfile(@Headers('authorization') authHeader: string) {
    return this.authService.getProfile(authHeader);
  }
}