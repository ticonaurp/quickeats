import { Injectable } from '@nestjs/common';

@Injectable()
export class RestaurantService {
  // 💡 URL del microservicio de restaurantes
  private readonly baseUrl = 'http://localhost:3003';

  async forwardRequest(path: string, method: string, body?: any) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return response.json();
  }
}