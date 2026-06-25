import 'dotenv/config'; // <-- ¡AGREGA ESTO EN LA LÍNEA 1!
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Rechaza payloads con propiedades no declaradas en los DTOs y sanea el resto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Tu configuración de microservicio o CORS si tienes...

  // Respetamos el PORT que inyectan Render/Azure/Docker; en local cae a 3002.
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  console.log(`Auth-service corriendo en el puerto ${port}`);
}
bootstrap();