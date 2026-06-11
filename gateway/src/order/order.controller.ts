import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';

@Controller('orders') // http://localhost:3001/orders
export class OrderController {
  // 🌐 CLAVE DE INFRAESTRUCTURA:
  // Leemos la URL asignada por Render. Si no existe (como en local), usa el fallback al puerto 3004.
  private readonly ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL
    ? `${process.env.ORDER_SERVICE_URL}/orders`
    : 'http://localhost:3004/orders';

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
}