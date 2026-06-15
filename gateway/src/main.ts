import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS para que tu Frontend (puerto 3000) pueda leer las respuestas
  // 🌟 Cambia solo este bloque dentro de tu app.enableCors:
app.enableCors({
  origin: '*', // 🎯 Forzamos el comodín para desarrollo local e IP de red
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});

  // 🎯 CORRECCIÓN: Forzamos la escucha en '0.0.0.0' para abrir las compuertas de Docker
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🏛️ API Gateway running permanently on port ${port}`);
}
bootstrap();