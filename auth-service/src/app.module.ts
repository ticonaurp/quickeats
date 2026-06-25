import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // ventana de 1 minuto
        limit: 20, // límite global por defecto; login/register usan @Throttle con límite más estricto
      },
    ]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService, // <-- Agregado aquí
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}