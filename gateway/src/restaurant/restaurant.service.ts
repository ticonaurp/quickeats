import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

  // 🌐 En Docker, docker-compose inyecta RESTAURANT_SERVICE_URL=http://restaurant-service:3003.
  // En local (sin esa variable) usamos localhost para que el Gateway sí pueda resolver el microservicio.
  private readonly baseUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3003';

  async forwardRequest(path: string, method: string, body?: any) {
    // 🧹 Sanitizamos el path para asegurar que siempre empiece con '/' y no rompa la URL
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = `${this.baseUrl}${cleanPath}`;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      // 🛡️ Si la respuesta no es exitosa (2xx), capturamos el error original del microservicio
      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Fallo en microservicio [${response.status}] al apuntar a ${fullUrl}: ${errorText}`);
        throw new Error(`Error en el servidor de restaurantes: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // 🎯 Solución al linter: Validamos el tipo 'unknown' de TypeScript de forma segura
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.logger.error(`💥 Error crítico de red intentando conectar con ${fullUrl}: ${errorMessage}`);
      throw error;
    }
  }
}