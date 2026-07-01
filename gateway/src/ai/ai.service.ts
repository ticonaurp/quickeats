import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  ChatSession,
  FunctionDeclarationsTool,
  GoogleGenerativeAI,
  SchemaType,
} from '@google/generative-ai';
import { ChatRequestDto } from './dto/chat.dto';
import {
  AddProductToCartArgs,
  AddToCartActionResponse,
  AiChatResponse,
  GetOrderStatusArgs,
  OrderStatusServiceResponse,
  ProductServiceItem,
} from './interfaces/ai-response.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;

  // 🟢 En Docker/Render se inyectan las URLs de los microservicios; en local caen a localhost.
  private readonly orderServiceUrl = `${process.env.ORDER_SERVICE_URL || 'http://localhost:3004'}/orders`;
  private readonly restaurantServiceUrl = `${process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3003'}/products`;

  private readonly tools: FunctionDeclarationsTool[] = [
    {
      functionDeclarations: [
        {
          name: 'get_order_status',
          description:
            'Obtiene el estado actual (ej. PENDING, PREPARING) y el restaurante de una orden específica del usuario.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              orderId: {
                type: SchemaType.STRING,
                description:
                  'El identificador de la orden a consultar. Puede ser el UUID completo o el código corto de 8 caracteres que el usuario ve en pantalla (ej. "9E6A6404" o "#9E6A6404").',
              },
            },
            required: ['orderId'],
          },
        },
        {
          name: 'add_product_to_cart',
          description:
            'Busca un producto por nombre en el catálogo del restaurante y prepara la acción para agregarlo al carrito del cliente.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              productName: {
                type: SchemaType.STRING,
                description: 'Nombre o descripción aproximada del producto que el usuario quiere agregar.',
              },
              quantity: {
                type: SchemaType.NUMBER,
                description: 'Cantidad de unidades del producto a agregar. Si el usuario no la menciona, usa 1.',
              },
            },
            required: ['productName'],
          },
        },
      ],
    },
  ];

  // 🧠 Reglas de comportamiento fijas para el modelo: extracción de producto/cantidad y tono de respuesta.
  private readonly systemInstruction = [
    'Eres el asistente experto de QuickEats con IA. Tu único objetivo es mapear los mensajes del usuario a las herramientas disponibles (get_order_status y add_product_to_cart).',
    "Al extraer 'productName', haz una limpieza agresiva de verbos (quiero, ponme, añade), artículos y adjetivos. Extrae solo el núcleo (ej: si dicen 'un burger master xfa' o 'quiero un par de hamburguesas de Burger Master', el productName DEBE ser simplemente 'Burger Master').",
    "Interpreta cantidades coloquiales en el parámetro 'quantity' (ej: 'un par' = 2, 'media docena' = 6). Si no se especifica, por defecto es 1.",
    'Si el usuario mezcla intenciones (rastrear orden y pedir comida a la vez), prioriza la acción de agregar al carrito o la que aparezca primero, y menciónale de forma muy breve la otra en el texto final.',
    'Mantén tus respuestas conversacionales sumamente cortas, dinámicas y con un tono amable peruano.',
  ].join('\n');

  constructor(private readonly httpService: HttpService) {
    const apiKey = process.env.GEMINI_API_KEY || this.readEnvFileFallback('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('⚠️ GEMINI_API_KEY no está configurada. El chatbot de IA no funcionará.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey ?? '');
  }

  // 🟡 Fallback manual: cuando se levanta el gateway vía `concurrently` (start:all) sin Docker,
  // process.env no siempre trae las variables de gateway/.env. Como respaldo, lo parseamos a mano.
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

        return trimmed
          .slice(separatorIndex + 1)
          .trim()
          .replace(/^["']|["']$/g, '');
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`⚠️ No se pudo leer gateway/.env como fallback: ${msg}`);
    }

    return undefined;
  }

  async chat(dto: ChatRequestDto): Promise<AiChatResponse> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        tools: this.tools,
        systemInstruction: this.systemInstruction,
      });

      const chatSession = model.startChat();
      const result = await chatSession.sendMessage(dto.message);
      const functionCalls = result.response.functionCalls();

      if (!functionCalls || functionCalls.length === 0) {
        return { type: 'message', message: result.response.text() };
      }

      const call = functionCalls[0];

      if (call.name === 'get_order_status') {
        return await this.handleOrderStatus(chatSession, call.args as unknown as GetOrderStatusArgs, dto.userId);
      }

      if (call.name === 'add_product_to_cart') {
        return await this.handleAddToCart(chatSession, call.args as unknown as AddProductToCartArgs);
      }

      return {
        type: 'message',
        message: 'No pude entender qué acción realizar. ¿Podrías reformular tu mensaje?',
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al comunicarse con Gemini: ${msg}`);
      return {
        type: 'message',
        message: 'Tuve un problema para procesar tu mensaje. ¿Podrías intentarlo de nuevo en un momento?',
      };
    }
  }

  // 🔍 Tool: get_order_status -> consulta el order-service y deja que Gemini redacte la respuesta
  private async handleOrderStatus(
    chatSession: ChatSession,
    args: GetOrderStatusArgs,
    userId?: string,
  ): Promise<AiChatResponse> {
    // 🧹 El usuario suele escribir el código visual con '#' (ej. "#9E6A6404"); el order-service no lo espera.
    const cleanedOrderId = args.orderId.trim().replace(/^#/, '');

    try {
      const order = await this.resolveOrder(cleanedOrderId, userId);

      if (!order) {
        return {
          type: 'message',
          message: 'No pude encontrar información sobre esa orden. Verifica el número e intenta de nuevo.',
        };
      }

      const followUp = await chatSession.sendMessage([
        {
          functionResponse: {
            name: 'get_order_status',
            response: {
              status: order.status,
              restaurantName: order.restaurantName,
            },
          },
        },
      ]);

      return { type: 'message', message: followUp.response.text() };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`💥 Error al consultar la orden ${cleanedOrderId}: ${msg}`);
      return {
        type: 'message',
        message: 'No pude encontrar información sobre esa orden. Verifica el número e intenta de nuevo.',
      };
    }
  }

  // 🔎 1) Intenta match exacto por ID completo. 2) Si el usuario pasó el código corto (8 caracteres,
  // el primer bloque del UUID que se muestra en el frontend) y conocemos su userId, buscamos por
  // prefijo dentro de SU historial de órdenes (nunca en el de otros usuarios, por privacidad).
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

  // 🛒 Tool: add_product_to_cart -> busca el producto real y retorna el payload de acción para el frontend
  private async handleAddToCart(
    chatSession: ChatSession,
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

      // 🔢 Si el modelo no informa una cantidad válida, asumimos 1 en lugar de repreguntar
      const quantity = Number.isFinite(args.quantity) && Number(args.quantity) > 0 ? Number(args.quantity) : 1;

      const followUp = await chatSession.sendMessage([
        {
          functionResponse: {
            name: 'add_product_to_cart',
            response: {
              found: true,
              productId: match.id,
              name: match.name,
              quantity,
            },
          },
        },
      ]);

      const action: AddToCartActionResponse = {
        type: 'action',
        action: 'ADD_TO_CART',
        payload: {
          productId: match.id,
          name: match.name,
          quantity,
        },
        message: followUp.response.text(),
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

  // 🔎 Matching en 3 niveles: exacto -> el nombre de BD incluye la query -> la query incluye el nombre de BD.
  // El tercer nivel es lo que permite que "un burger master xfa" matchee con "Hamburguesa Burger Master".
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
