import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Mantenemos habilitado CORS
  await app.listen(3005);
  console.log(' Notification Service running on port 3005');
}
bootstrap();