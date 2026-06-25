import { Controller, Get, Post, Patch, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';

@Controller('orders') // http://localhost:3001/orders
export class OrderController {
  // 🟢 En Docker/Render se inyecta ORDER_SERVICE_URL; en local cae a localhost para resolver bien.
  private readonly ORDER_SERVICE_URL = `${process.env.ORDER_SERVICE_URL || 'http://localhost:3004'}/orders`;

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

  // Ejemplo de optimización para tus métodos en gateway/src/order/order.controller.ts

@Get()
async findAllOrders(@Res() res: Response) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000); // ⏱️ 7 segundos de tolerancia

  try {
    const response = await fetch(this.ORDER_SERVICE_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    clearTimeout(timeoutId);
    const isTimeout = error.name === 'AbortError';
    
    return res.status(HttpStatus.BAD_GATEWAY).json({
      message: isTimeout 
        ? 'El microservicio de órdenes tardó demasiado en responder (Timeout).' 
        : 'No se pudo conectar con el microservicio de órdenes.',
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