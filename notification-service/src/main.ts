import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Mantenemos habilitado CORS

  // Rechaza payloads con propiedades no declaradas en los DTOs y sanea el resto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3005);
  console.log(' Notification Service running on port 3005');
}
bootstrap();