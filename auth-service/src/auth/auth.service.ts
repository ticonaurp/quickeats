import { Injectable, BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Validar si el correo ya existe
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      this.logger.warn(`Intento de registro con correo ya existente: ${dto.email}`);
      throw new BadRequestException('El correo ya está registrado');
    }

    // 2. Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Guardar en PostgreSQL
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        // SOLUCIÓN: Quitamos la línea "role: 'USER'" de aquí.
        // Como en tu schema.prisma ya tiene '@default(USER)', 
        // la base de datos se encargará de asignarlo automáticamente de forma segura.
      },
    });

    this.logger.log(`Nuevo usuario registrado: ${user.email} (id: ${user.id})`);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      message: 'Usuario registrado con éxito',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      this.logger.warn(`Login fallido: correo no registrado (${dto.email})`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login fallido: contraseña incorrecta para ${dto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    this.logger.log(`Login exitoso: ${user.email} (id: ${user.id}, rol: ${user.role})`);

    return {
      access_token: token,
      role: user.role,
      name: user.name,
      message: 'Login exitoso',
    };
  }
}