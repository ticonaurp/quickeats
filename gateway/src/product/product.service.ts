import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  // 🟢 SOLUCIÓN DE ENTORNO: Lee la variable de Docker. Si falla, usa el DNS interno como respaldo.
  private readonly baseUrl = `${process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:3003'}/products`;

  constructor(private readonly httpService: HttpService) {}

  // 🚀 1. Redirige la creación del producto
  async create(body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.baseUrl, body)
      );
      return response.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al crear producto en ${this.baseUrl}: ${msg}`);
      throw error;
    }
  }

  // 🔍 2. Redirige la obtención de un producto específico por ID
  async findOne(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/${id}`)
      );
      return response.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al buscar producto ${id}: ${msg}`);
      throw error;
    }
  }

  // 🔄 3. Redirige la actualización del producto
  async update(id: string, body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.baseUrl}/${id}`, body)
      );
      return response.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al actualizar producto ${id}: ${msg}`);
      throw error;
    }
  }

  // 📋 4. Redirige la lista de todos los productos (🟢 CORREGIDO: Ahora acepta y reenvía el restaurantId)
  async findAll(restaurantId?: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, {
          // Usamos la propiedad params de Axios para clavar el query param automáticamente
          params: restaurantId ? { restaurantId } : {},
        })
      );
      return response.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al listar productos desde ${this.baseUrl}: ${msg}`);
      throw error;
    }
  }

  // ❌ 5. Redirige la eliminación física del producto hacia el microservicio
  async remove(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.baseUrl}/${id}`)
      );
      return response.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al eliminar producto ${id}: ${msg}`);
      throw error;
    }
  }
  
}