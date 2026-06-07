import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  // Conectado con éxito al puerto interno real de tu restaurant-service
  private readonly baseUrl = 'http://localhost:3003/products'; 

  constructor(private readonly httpService: HttpService) {}

  // 🚀 1. Redirige la creación del producto
  async create(body: any) {
    const response = await firstValueFrom(
      this.httpService.post(this.baseUrl, body)
    );
    return response.data;
  }

  // 🔍 2. Redirige la obtención de un producto específico por ID (para la pantalla de editar)
  async findOne(id: string) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/${id}`)
    );
    return response.data;
  }

  // 🔄 3. Redirige la actualización del producto
  async update(id: string, body: any) {
    const response = await firstValueFrom(
      this.httpService.put(`${this.baseUrl}/${id}`, body)
    );
    return response.data;
  }

  // 📋 4. Redirige la lista de todos los productos
  async findAll() {
    const response = await firstValueFrom(
      this.httpService.get(this.baseUrl)
    );
    return response.data;
  }

  // ❌ 5. AGREGADO: Redirige la eliminación física del producto hacia el microservicio
  async remove(id: string) {
    const response = await firstValueFrom(
      this.httpService.delete(`${this.baseUrl}/${id}`)
    );
    return response.data;
  }
}