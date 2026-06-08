import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 👈 Importamos esto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ Activamos la validación automática global para los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades del body que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza un error si mandan propiedades no permitidas
      transform: true, // Transforma automáticamente los tipos (ej: string a number)
    }),
  );

  await app.listen(process.env.PORT ?? 3004);
  console.log(`🛒 Order Service running on port ${process.env.PORT ?? 3004}`);
}
bootstrap();