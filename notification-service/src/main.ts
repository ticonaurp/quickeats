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

  // Respetamos el PORT que inyectan Render/Azure/Docker; en local cae a 3005.
  const port = process.env.PORT ?? 3005;
  await app.listen(port);
  console.log(`Notification Service running on port ${port}`);
}
bootstrap();