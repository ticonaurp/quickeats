import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import OpenAI from 'openai';
import { ChatRequestDto } from './dto/chat.dto';
import {
  AddProductToCartArgs,
  AddToCartActionResponse,
  AiChatResponse,
  GetOrderStatusArgs,
  OrderStatusServiceResponse,
  ProductServiceItem,
  RestaurantServiceItem,
} from './interfaces/ai-response.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  // 🟢 URLs inyectadas para entornos Docker/K8s o locales
  private readonly orderServiceUrl = `${process.env.ORDER_SERVICE_URL || 'http://localhost:3004'}/orders`;
  private readonly restaurantServiceBaseUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3003';
  private readonly restaurantServiceUrl = `${this.restaurantServiceBaseUrl}/products`;

  // 🛠️ Definición de herramientas en formato OpenAI / Groq
  private readonly tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'get_order_status',
        description: 'Obtiene el estado actual (ej. PENDING, PREPARING) y el restaurante de una orden específica del usuario.',
        parameters: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'El identificador de la orden a consultar. Puede ser el UUID completo o el código corto de 8 caracteres que el usuario ve en pantalla (ej. "9E6A6404" o "#9E6A6404").',
            },
          },
          required: ['orderId'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'add_product_to_cart',
        description: 'Busca un producto por nombre en el catálogo del restaurante y prepara la acción para agregarlo al carrito del cliente.',
        parameters: {
          type: 'object',
          properties: {
            productName: {
              type: 'string',
              description: 'Nombre o descripción aproximada del producto que el usuario quiere agregar.',
            },
            quantity: {
              type: 'number',
              description: 'Cantidad de unidades del producto a agregar. Si el usuario no la menciona, usa 1.',
            },
          },
          required: ['productName'],
        },
      },
    },
  ];

  // 🧠 Reglas de comportamiento optimizadas
  private readonly systemInstruction = [
    'Eres el asistente experto de QuickEats con IA. Tu único objetivo es mapear los mensajes del usuario a las herramientas disponibles (get_order_status y add_product_to_cart).',
    "Al extraer 'productName', haz una limpieza agresiva de verbos (quiero, ponme, añade), artículos y adjetivos. Extrae solo el núcleo (ej: si dicen 'un burger master xfa', el productName DEBE ser simplemente 'Burger Master').",
    "Interpreta cantidades coloquiales en 'quantity' (ej: 'un par' = 2, 'media docena' = 6). Por defecto es 1.",
    'Si el usuario mezcla intenciones, prioriza agregar al carrito e indica brevemente la otra acción en tu mensaje.',
    'Mantén tus respuestas conversacionales sumamente cortas, dinámicas y con un tono amable peruano.',
  ].join('\n');

  constructor(private readonly httpService: HttpService) {
    const apiKey = process.env.GROQ_API_KEY || this.readEnvFileFallback('GROQ_API_KEY');
    if (!apiKey) {
      this.logger.warn('⚠️ GROQ_API_KEY no está configurada. El chatbot de IA no funcionará.');
    }
    
    // Conexión directa a la infraestructura de Groq
    this.openai = new OpenAI({
      apiKey: apiKey ?? '',
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  private readEnvFileFallback(key: string): string | undefined {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) continue;
        const currentKey = trimmed.slice(0, separatorIndex).trim();
        if (currentKey !== key) continue;
        return trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`⚠️ No se pudo leer gateway/.env como fallback: ${msg}`);
    }
    return undefined;
  }

  async chat(dto: ChatRequestDto): Promise<AiChatResponse> {
    try {
      const mappedHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = (dto.history || []).map((h) => ({
        role: h.role === 'model' ? 'assistant' : (h.role as 'user' | 'system'),
        content: typeof h.parts === 'string' ? h.parts : h.parts?.[0]?.text || '',
      }));

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: this.systemInstruction },
        ...mappedHistory,
        { role: 'user', content: dto.message },
      ];

      // Uso del modelo Llama 3 en Groq (Ultra rápido y sin costos)
      const response = await this.openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages,
        tools: this.tools,
        tool_choice: 'auto',
        max_tokens: 150,
        temperature: 0.5,
      });

      const messageResult = response.choices[0].message;

      if (!messageResult.tool_calls || messageResult.tool_calls.length === 0) {
        return { type: 'message', message: messageResult.content || '' };
      }

      const toolCall = messageResult.tool_calls[0];

      // 🛠️ Validación estricta con "in" para convencer a TypeScript y limpiar los errores del linter
      if ('function' in toolCall) {
        const args = JSON.parse(toolCall.function.arguments);

        if (toolCall.function.name === 'get_order_status') {
          return await this.handleOrderStatus(messages, toolCall, args as GetOrderStatusArgs, dto.userId);
        }

        if (toolCall.function.name === 'add_product_to_cart') {
          return await this.handleAddToCart(messages, toolCall, args as AddProductToCartArgs);
        }
      }

      return {
        type: 'message',
        message: 'No pude entender qué acción realizar. ¿Podrías reformular tu mensaje?',
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al comunicarse con Groq: ${msg}`);
      return {
        type: 'message',
        message: 'Tuve un problema para procesar tu mensaje. ¿Podrías intentarlo de nuevo en un momento?',
      };
    }
  }

  private async handleOrderStatus(
    previousMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    args: GetOrderStatusArgs,
    userId?: string,
  ): Promise<AiChatResponse> {
    const cleanedOrderId = args.orderId.trim().replace(/^#/, '');

    try {
      const order = await this.resolveOrder(cleanedOrderId, userId);

      if (!order) {
        return {
          type: 'message',
          message: 'No pude encontrar información sobre esa orden. Verifica el número e intenta de nuevo.',
        };
      }

      const followUpResponse = await this.openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          ...previousMessages,
          { role: 'assistant', tool_calls: [toolCall] },
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              status: order.status,
              restaurantName: order.restaurantName,
            }),
          },
        ],
      });

      return { type: 'message', message: followUpResponse.choices[0].message.content || '' };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al consultar la orden ${cleanedOrderId}: ${msg}`);
      return {
        type: 'message',
        message: 'No pude encontrar información sobre esa orden. Verifica el número e intenta de nuevo.',
      };
    }
  }

  private async resolveOrder(
    orderId: string,
    userId?: string,
  ): Promise<OrderStatusServiceResponse | undefined> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<OrderStatusServiceResponse>(`${this.orderServiceUrl}/${orderId}`),
      );
      return data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`⚠️ Match exacto falló para "${orderId}" (${msg}). Intentando por prefijo corto.`);
    }

    if (!userId) {
      this.logger.warn('⚠️ No hay userId disponible para resolver el código corto de la orden.');
      return undefined;
    }

    const { data: userOrders } = await firstValueFrom(
      this.httpService.get<OrderStatusServiceResponse[]>(`${this.orderServiceUrl}/user/${userId}`),
    );

    const normalized = orderId.toLowerCase();
    return userOrders.find((order) => order.id.toLowerCase().startsWith(normalized));
  }

  private async handleAddToCart(
    previousMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
    args: AddProductToCartArgs,
  ): Promise<AiChatResponse> {
    try {
      const { data: products } = await firstValueFrom(
        this.httpService.get<ProductServiceItem[]>(this.restaurantServiceUrl),
      );

      const match = this.findClosestProduct(products, args.productName);

      if (!match) {
        return {
          type: 'message',
          message: `No encontré ningún producto parecido a "${args.productName}" en el menú.`,
        };
      }

      const quantity = Number.isFinite(args.quantity) && Number(args.quantity) > 0 ? Number(args.quantity) : 1;

      const { data: restaurant } = await firstValueFrom(
        this.httpService.get<RestaurantServiceItem>(`${this.restaurantServiceBaseUrl}/restaurants/${match.restaurantId}`),
      );

      const followUpResponse = await this.openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          ...previousMessages,
          { role: 'assistant', tool_calls: [toolCall] },
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              found: true,
              productId: match.id,
              name: match.name,
              quantity,
            }),
          },
        ],
      });

      const action: AddToCartActionResponse = {
        type: 'action',
        action: 'ADD_TO_CART',
        payload: {
          productId: match.id,
          name: match.name,
          price: Number(match.price ?? 0),
          image: match.image ?? '',
          calories: match.calories ?? null,
          quantity,
          restaurantId: match.restaurantId,
          restaurantName: restaurant.name,
          restaurantDeliveryFee: Number(restaurant.deliveryFee ?? 0),
          restaurantDeliveryTime: Number(restaurant.deliveryTime ?? 20),
        },
        message: followUpResponse.choices[0].message.content || '',
      };

      return action;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al buscar el producto "${args.productName}": ${msg}`);
      return {
        type: 'message',
        message: 'Tuve un problema buscando ese producto en el menú. Intenta de nuevo en un momento.',
      };
    }
  }

  private findClosestProduct(
    products: ProductServiceItem[],
    productName: string,
  ): ProductServiceItem | undefined {
    const normalizedQuery = productName.trim().toLowerCase();
    return (
      products.find((p) => p.name.trim().toLowerCase() === normalizedQuery) ??
      products.find((p) => p.name.trim().toLowerCase().includes(normalizedQuery)) ??
      products.find((p) => normalizedQuery.includes(p.name.trim().toLowerCase()))
    );
  }
}