import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 🎯 EL CAMBIO CLAVE: Forzamos la escucha en el puerto 3003 e IP 0.0.0.0
  const port = process.env.PORT ?? 3003;
  await app.listen(port, '0.0.0.0');
}
bootstrap();