import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  // 🕒 FUNCIÓN MAESTRA INTEGRAL: Calcula la apertura soportando textos ("Domingo") y números (7)
  private checkIsOpen(restaurant: any): boolean {
    // 🌎 Los contenedores (Docker/Azure) corren en UTC, no en hora de Lima.
    // Usar new Date().getHours()/getDay() ahí toma la hora del SO del contenedor,
    // no la de Perú, lo que marca restaurantes cerrados/abiertos incorrectamente.
    // Por eso calculamos la hora y el día SIEMPRE en la zona horaria 'America/Lima'.
    const limaParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());

    const getPart = (type: string) => limaParts.find((p) => p.type === type)?.value ?? '';

    // 1. Minutos actuales en Lima (Ej: 21:41 -> 21 * 60 + 41 = 1301 minutos)
    const minutosActuales = parseInt(getPart('hour'), 10) * 60 + parseInt(getPart('minute'), 10);

    // 2. Controlar el índice del día a partir del weekday en inglés que devuelve Intl (Mon, Tue, ...)
    const weekdayToIndex: { [key: string]: number } = {
      MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7,
    };
    const diaActual = weekdayToIndex[getPart('weekday').toUpperCase()] ?? 1;

    // 🎯 MATCHER DE DÍAS: Mapeamos todas las formas posibles en las que se pudo guardar "Domingo"
    const dicDias: { [key: number]: string[] } = {
      1: ['1', 'LUNES', 'MONDAY', 'LUN'],
      2: ['2', 'MARTES', 'TUESDAY', 'MAR'],
      3: ['3', 'MIÉRCOLES', 'MIERCOLES', 'WEDNESDAY', 'MIE'],
      4: ['4', 'JUEVES', 'THURSDAY', 'JUE'],
      5: ['5', 'VIERNES', 'FRIDAY', 'VIE'],
      6: ['6', 'SÁBADO', 'SABADO', 'SATURDAY', 'SAB'],
      7: ['7', '0', 'DOMINGO', 'SUNDAY', 'DOM'] // Soporta el número 7, 0 o el texto "Domingo"
    };

    const formatosHoy = dicDias[diaActual] || [];

    // 🆕 Si el restaurante NO tiene ningún horario configurado, NO lo dejamos cerrado para siempre:
    // respetamos el switch manual 'isOpen'. Así el toggle del panel admin tiene efecto real.
    // (Los restaurantes que SÍ tienen horarios siguen rigiéndose por la hora.)
    if (!restaurant.openingHours || restaurant.openingHours.length === 0) {
      return restaurant.isOpen ?? true;
    }

    // 3. Buscar el horario de hoy en la relación de Prisma
    const horarioHoy = restaurant.openingHours?.find((h: any) => {
      const campoDia = h.dayOfWeek ?? h.day ?? h.dia;
      if (campoDia === undefined || campoDia === null) return false;
      
      // Limpiamos el valor de la BD (Ej: "Domingo " -> "DOMINGO")
      const diaBDStr = String(campoDia).toUpperCase().trim();
      return formatosHoy.includes(diaBDStr);
    });

    // Si no hay horarios para hoy, se considera cerrado
    if (!horarioHoy) return false; 

    // 4. PARSER DE TIEMPO COMPLETO: Procesa "09:44 PM", "21:44", "9:44" sin distinción
    const timeToMinutes = (timeStr: string): number => {
      if (!timeStr) return 0;
      const cleanStr = timeStr.toUpperCase().trim();
      
      let hours = 0;
      let minutes = 0;
      
      if (cleanStr.includes('AM') || cleanStr.includes('PM')) {
        const isPM = cleanStr.includes('PM');
        const timePart = cleanStr.replace('AM', '').replace('PM', '').trim();
        const parts = timePart.split(':');
        
        hours = parseInt(parts[0], 10);
        minutes = parts[1] ? parseInt(parts[1], 10) : 0;
        
        if (hours === 12) hours = 0; 
        if (isPM) hours += 12;       
      } else {
        const parts = cleanStr.split(':');
        hours = parseInt(parts[0], 10);
        minutes = parts[1] ? parseInt(parts[1], 10) : 0;
      }
      
      return hours * 60 + minutes;
    };

    const inicio = horarioHoy.openTime || horarioHoy.openingTime || horarioHoy.open || horarioHoy.horaApertura;
    const fin = horarioHoy.closeTime || horarioHoy.closingTime || horarioHoy.close || horarioHoy.horaCierre;

    const minutosInicio = timeToMinutes(inicio);
    const minutosFin = timeToMinutes(fin);

    const switchManual = restaurant.isOpen ?? true;

    return switchManual && (minutosActuales >= minutosInicio && minutosActuales < minutosFin);
  }

  // 1. Crear un restaurante junto con sus horarios
  async create(dto: CreateRestaurantDto) {
    const { openingHours, ...restaurantData } = dto;

    const restaurant = await this.prisma.restaurant.create({
      data: {
        ...restaurantData,
        openingHours: {
          create: openingHours,
        },
      },
      include: {
        openingHours: true, 
      },
    });

    return { ...restaurant, isOpen: this.checkIsOpen(restaurant) };
  }

  // 2. Listar todos (Calcula el estado dinámicamente para el cliente/admin)
  async findAll() {
    const restaurants = await this.prisma.restaurant.findMany({
      include: { openingHours: true },
      orderBy: { createdAt: 'desc' },
    });

    return restaurants.map((r) => ({
      ...r,
      isOpen: this.checkIsOpen(r),
    }));
  }

  // 3. Buscar uno solo por ID (Calcula el estado dinámicamente)
  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { openingHours: true },
    });
    
    if (!restaurant) {
      throw new NotFoundException(`El restaurante con ID ${id} no existe.`);
    }

    return {
      ...restaurant,
      isOpen: this.checkIsOpen(restaurant),
    };
  }

  // 4. Modificar restaurante y actualizar sus horarios
  async update(id: string, dto: Partial<CreateRestaurantDto>) {
    await this.findOne(id); 
    const { openingHours, ...restaurantData } = dto;

    const updatedRestaurant = await this.prisma.restaurant.update({
      where: { id },
      data: {
        ...restaurantData,
        ...(openingHours && {
          openingHours: {
            deleteMany: {}, 
            create: openingHours, 
          },
        }),
      },
      include: { openingHours: true },
    });

    return {
      ...updatedRestaurant,
      isOpen: this.checkIsOpen(updatedRestaurant),
    };
  }
}