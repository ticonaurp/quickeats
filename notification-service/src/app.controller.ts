import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('notifications')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createNotification(
    @Body() body: { userId: string; message: string },
  ) {
    return this.appService.createNotification(body.userId, body.message);
  }

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    return this.appService.getNotificationsByUser(userId);
  }
}