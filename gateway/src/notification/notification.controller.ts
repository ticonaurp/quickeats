import { Controller, Get, Post, Patch, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';

@Controller('notifications') // http://localhost:3001/notifications
export class NotificationController {
  // 🌐 CLAVE DE INFRAESTRUCTURA:
  // En Docker/Render se inyecta NOTIFICATION_SERVICE_URL; en local cae a localhost (mismo patrón que el resto del Gateway).
  private readonly NOTIFICATION_SERVICE_URL = `${process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005'}/notifications`;

  @Post()
  async createNotification(@Body() body: any, @Res() res: Response) {
    try {
      const response = await fetch(this.NOTIFICATION_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de notificaciones.',
      });
    }
  }

  @Get(':userId')
  async findNotificationsByUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const response = await fetch(`${this.NOTIFICATION_SERVICE_URL}/${userId}`);
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de notificaciones.',
      });
    }
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await fetch(`${this.NOTIFICATION_SERVICE_URL}/${id}/read`, {
        method: 'PATCH',
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de notificaciones.',
      });
    }
  }
}