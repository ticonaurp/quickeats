import { Controller, Get, Post, Patch, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';

@Controller('orders') // http://localhost:3001/orders
export class OrderController {
  // 🟢 Leemos la URL del .env. En Render viene seteada; en Docker local usamos el DNS del contenedor.
  private readonly ORDER_SERVICE_URL = `${process.env.ORDER_SERVICE_URL || 'http://order-service:3004'}/orders`;

  @Post()
  async createOrder(@Body() body: any, @Res() res: Response) {
    try {
      const response = await fetch(this.ORDER_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de órdenes.',
      });
    }
  }

  @Get()
  async findAllOrders(@Res() res: Response) {
    try {
      const response = await fetch(this.ORDER_SERVICE_URL);
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de órdenes.',
      });
    }
  }

  // 👤 Reenvía la consulta de órdenes filtradas por usuario
  @Get('user/:userId')
  async findOrdersByUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const response = await fetch(`${this.ORDER_SERVICE_URL}/user/${userId}`);
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de órdenes.',
      });
    }
  }

  @Get(':id')
  async findOneOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await fetch(`${this.ORDER_SERVICE_URL}/${id}`);
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de órdenes.',
      });
    }
  }

  // 🔄 Reenvía el cambio de estado de una orden (panel de administrador)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const response = await fetch(`${this.ORDER_SERVICE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({
        message: 'No se pudo conectar con el microservicio de órdenes.',
      });
    }
  }
}