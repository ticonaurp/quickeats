import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importamos
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Forzamos la carga del archivo .env
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}