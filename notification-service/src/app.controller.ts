import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createNotification(@Body() dto: CreateNotificationDto) {
    return this.appService.createNotification(dto.userId, dto.message);
  }

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    return this.appService.getNotificationsByUser(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.appService.markAsRead(id);
  }
}