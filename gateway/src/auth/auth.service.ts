import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    // Definimos la URL base de nuestro microservicio de autenticación
    private readonly authServiceUrl = 'http://localhost:3002/auth';

    constructor(private readonly httpService: HttpService) { }

    async register(body: any) {
        try {
            // Reenviamos los datos al puerto 3002
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/register`, body)
            );
            return response.data;
        } catch (error: any) {
            // Si el microservicio responde con error (ej. 400), lo capturamos y se lo pasamos al frontend
            throw new HttpException(
                error.response?.data || 'Error interno en Auth Service',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async login(body: any) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/login`, body)
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(
                error.response?.data || 'Error interno en Auth Service',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getProfile(token: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.authServiceUrl}/profile`, {
                    headers: { Authorization: token }, // <-- Pasamos el token al microservicio
                })
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(
                error.response?.data || 'Error en Auth Service',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}