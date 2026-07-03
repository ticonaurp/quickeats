export class ChatRequestDto {
  message!: string;
  userId?: string;
  
  // 🧠 Este arreglo le permitirá a NestJS recibir el historial estructurado desde el frontend
  history?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
}