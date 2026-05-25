import { Controller, Get } from '@nestjs/common';

@Controller('auth-proxy')
export class AppController {
  
  @Get('test')
  async testConnection() {
    try {
      // 1. Apuntamos a la ruta explícita del microservicio
      const response = await fetch('http://localhost:3002/auth/health');
      
      // 2. Parseamos la respuesta directamente como JSON
      const data = await response.json();
      
      return {
        status: 'Gateway Operacional',
        connectedToAuth: true,
        authServiceResponse: data,
      };
    } catch (error) {
      return {
        status: 'Error',
        connectedToAuth: false,
        message: 'No se pudo conectar con el Auth-Service',
        error: (error as any).message,
      };
    }
  }
}