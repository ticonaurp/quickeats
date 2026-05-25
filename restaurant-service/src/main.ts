import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3003);
  console.log('Restaurant-service corriendo en el puerto 3003');
}
bootstrap();