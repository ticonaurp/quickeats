import 'dotenv/config'; // <-- ¡AGREGA ESTO EN LA LÍNEA 1!
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Tu configuración de microservicio o CORS si tienes...
  
  await app.listen(3002);
  console.log('Auth-service corriendo en el puerto 3002');
}
bootstrap();