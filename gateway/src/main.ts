import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔑 1. Habilitamos CORS dinámico para evitar bloqueos del navegador
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization', 
  });

  // 🔑 2. Forzamos la escucha en '0.0.0.0' para que Docker reciba tráfico externo
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🏛️ API Gateway running permanently on port ${port}`);
}
bootstrap();