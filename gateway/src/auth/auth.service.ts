import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';



@Injectable()

export class AuthService {

    // 🔑 SOLUCIÓN: Leemos la URL del .env que apunta a 'http://auth-service:3002'

    // Si por alguna razón no existiera, dejamos el fallback por defecto

    private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3002';



    constructor(private readonly httpService: HttpService) { }



    async register(body: any) {

        try {

            // 🕵️ Spy 1: Ver a qué URL exacta está intentando disparar el Gateway

            console.log('🚀 Gateway redirigiendo petición a:', `${this.authServiceUrl}/auth/register`);

           

            const response = await firstValueFrom(

                this.httpService.post(`${this.authServiceUrl}/auth/register`, body)

            );

            return response.data;

        } catch (error: any) {

            // 🕵️ Spy 2: Imprimir el verdadero error de red o de Axios en los logs de Docker

            console.error('❌ Error real atrapado en el Gateway:', error.message);

            if (error.response) {

                console.error('📦 Datos devueltos por el microservicio:', error.response.data);

            }



            throw new HttpException(

                error.response?.data || 'Error interno en Auth Service',

                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,

            );

        }

    }

    async login(body: any) {

        try {

            // Ahora apuntará correctamente a http://auth-service:3002/auth/login

            const response = await firstValueFrom(

                this.httpService.post(`${this.authServiceUrl}/auth/login`, body)

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

            // Ahora apuntará correctamente a http://auth-service:3002/auth/profile

            const response = await firstValueFrom(

                this.httpService.get(`${this.authServiceUrl}/auth/profile`, {

                    headers: { Authorization: token },

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