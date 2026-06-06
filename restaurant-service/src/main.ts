import { ValidationPipe } from '@nestjs/common'; // 👈 Asegúrate de importar esto
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👈 AGREGA ESTA LÍNEA EXACTA: Activa la magia de class-validator en toda la app
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();