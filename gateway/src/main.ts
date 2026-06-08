import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🛡️ ¡AGREGA ESTE BLOQUE AQUÍ!
  // Esto le da permiso a tu Frontend (puerto 3000) para hablar con el Gateway
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Mantenemos tu configuración original con la variable de entorno o el puerto 3001
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Gateway running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();