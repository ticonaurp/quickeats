import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; // <-- Importar esto
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [HttpModule], // <-- Registrar aquí
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}