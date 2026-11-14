import { Pool } from 'pg';
import crypto from 'node:crypto';

declare global {
  // eslint-disable-next-line no-var
  var __quickeatsPgPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global.__quickeatsPgPool) {
    const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || '';

    global.__quickeatsPgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return global.__quickeatsPgPool;
}

const JWT_SECRET = process.env.JWT_SECRET || 'quickeats_default_jwt_secret';

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function signJwt(payload: Record<string, unknown>, expiresInSeconds = 86400): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(fullPayload),
  )}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(unsigned).digest();
  return `${unsigned}.${base64UrlEncode(signature)}`;
}

export function verifyJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    const unsigned = `${headerB64}.${payloadB64}`;
    const expectedSig = base64UrlEncode(
      crypto.createHmac('sha256', JWT_SECRET).update(unsigned).digest(),
    );
    if (expectedSig !== signatureB64) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export interface OpeningHourRow {
  id?: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  restaurantId?: string;
}

export interface RestaurantRow {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  deliveryTime: number;
  deliveryFee: number;
  isOpen: boolean;
  isFeatured: boolean;
  image: string;
  createdAt: Date | string;
  openingHours?: OpeningHourRow[];
}

export function checkIsOpen(restaurant: RestaurantRow): boolean {
  const limaParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const getPart = (type: string) => limaParts.find((p) => p.type === type)?.value ?? '';
  const minutosActuales =
    parseInt(getPart('hour'), 10) * 60 + parseInt(getPart('minute'), 10);

  const weekdayToIndex: { [key: string]: number } = {
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
    SUN: 7,
  };
  const diaActual = weekdayToIndex[getPart('weekday').toUpperCase()] ?? 1;

  const dicDias: { [key: number]: string[] } = {
    1: ['1', 'LUNES', 'MONDAY', 'LUN'],
    2: ['2', 'MARTES', 'TUESDAY', 'MAR'],
    3: ['3', 'MIÉRCOLES', 'MIERCOLES', 'WEDNESDAY', 'MIE'],
    4: ['4', 'JUEVES', 'THURSDAY', 'JUE'],
    5: ['5', 'VIERNES', 'FRIDAY', 'VIE'],
    6: ['6', 'SÁBADO', 'SABADO', 'SATURDAY', 'SAB'],
    7: ['7', '0', 'DOMINGO', 'SUNDAY', 'DOM'],
  };

  const formatosHoy = dicDias[diaActual] || [];

  if (!restaurant.openingHours || restaurant.openingHours.length === 0) {
    return restaurant.isOpen ?? true;
  }

  const horarioHoy = restaurant.openingHours.find((h: any) => {
    const campoDia = h.dayOfWeek ?? h.day ?? h.dia;
    if (campoDia === undefined || campoDia === null) return false;
    const diaBDStr = String(campoDia).toUpperCase().trim();
    return formatosHoy.includes(diaBDStr);
  });

  if (!horarioHoy) return false;

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

  const inicio = (horarioHoy as any).openTime || (horarioHoy as any).openingTime;
  const fin = (horarioHoy as any).closeTime || (horarioHoy as any).closingTime;

  const minutosInicio = timeToMinutes(inicio);
  const minutosFin = timeToMinutes(fin);
  const switchManual = restaurant.isOpen ?? true;

  return switchManual && minutosActuales >= minutosInicio && minutosActuales < minutosFin;
}

