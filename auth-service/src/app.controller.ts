import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AppController {

  @Get('health')
  healthCheck() {
    return {
      service: 'auth-service',
      status: 'ok',
    };
  }
}