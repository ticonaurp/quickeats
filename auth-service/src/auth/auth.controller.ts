import { Controller, Post, Body, Get, UseGuards, Request, Res } from '@nestjs/common';
import * as express from 'express'; // 👈 Cambiamos el tipo de importación
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response // 👈 Ajustado aquí
  ) {
    const result = await this.authService.login(dto);
    
    // 🛡️ Almacenamiento seguro en Cookie HttpOnly invisible a atacantes XSS
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true solo en producción (HTTPS)
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // Expira en 15 minutos exactos
    });

    // Retornamos la data básica al frontend sin exponer el token crudo en la respuesta
    return {
      message: result.message,
      name: result.name,
      role: result.role,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response) { // 👈 Ajustado aquí
    res.clearCookie('access_token');
    return { message: 'Sesión cerrada con éxito' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return {
      message: 'Tienes acceso al perfil protegido',
      user: req.user,
    };
  }

  // 🔑 ENDPOINT CRÍTICO: Solo accesible por Administradores de QuickEats
  @Get('admin-dashboard-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') // Filtro estricto
  checkAdminStatus() {
    return { status: 'AUTHORIZED', target: 'QUICKEATS_CORE_GATEWAY' };
  }
}