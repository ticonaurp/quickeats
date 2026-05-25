import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- Importar Passport
import { JwtStrategy } from './jwt.strategy'; // <-- Importar tu Estrategia

@Module({
  imports: [
    PassportModule, // <-- Agregado aquí
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'super-secret-key-change-me',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy], // <-- Agregar JwtStrategy aquí
})
export class AuthModule {}