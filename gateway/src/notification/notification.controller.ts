import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';

@Controller('notifications') // http://localhost:3001/notifications
export class NotificationController {
  // Apuntamos al microservicio de notificaciones que ya dejamos operativo en el 3005
  private readonly NOTIFICATION_SERVICE_URL = 'http://localhost:3005/notifications';

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
}