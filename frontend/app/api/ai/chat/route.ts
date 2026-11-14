import { NextRequest, NextResponse } from 'next/server';
import { getPool, checkIsOpen } from '../../_lib/db';

const SYSTEM_INSTRUCTION = [
  'Eres el asistente experto de QuickEats con IA. Tu único objetivo es mapear los mensajes del usuario a las herramientas disponibles (get_order_status y add_product_to_cart).',
  "Al extraer 'productName', haz una limpieza agresiva de verbos (quiero, ponme, añade), artículos y adjetivos. Extrae solo el núcleo (ej: si dicen 'un burger master xfa', el productName DEBE ser simplemente 'Burger Master').",
  "Interpreta cantidades coloquiales en 'quantity' (ej: 'un par' = 2, 'media docena' = 6). Por defecto es 1.",
  'Si el usuario mezcla intenciones, prioriza agregar al carrito e indica brevemente la otra acción en tu mensaje.',
  'Mantén tus respuestas conversacionales sumamente cortas, dinámicas y con un tono amable peruano.',
].join('\n');

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_order_status',
      description:
        'Obtiene el estado actual (ej. PENDING, PREPARING) y el restaurante de una orden específica del usuario.',
      parameters: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            description:
              'El identificador de la orden a consultar. Puede ser el UUID completo o el código corto de 8 caracteres que el usuario ve en pantalla (ej. "9E6A6404" o "#9E6A6404").',
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
      description:
        'Busca un producto por nombre en el catálogo del restaurante y prepara la acción para agregarlo al carrito del cliente.',
      parameters: {
        type: 'object',
        properties: {
          productName: {
            type: 'string',
            description:
              'Nombre o descripción aproximada del producto que el usuario quiere agregar.',
          },
          quantity: {
            type: 'number',
            description:
              'Cantidad de unidades del producto a agregar. Si el usuario no la menciona, usa 1.',
          },
        },
        required: ['productName'],
      },
    },
  },
];

function findClosestProduct(products: any[], productName: string): any | undefined {
  const normalize = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

  const normalizedQuery = normalize(productName);
  const exactOrContained =
    products.find((p) => normalize(p.name) === normalizedQuery) ??
    products.find((p) => normalize(p.name).includes(normalizedQuery)) ??
    products.find((p) => normalizedQuery.includes(normalize(p.name)));
  if (exactOrContained) return exactOrContained;

  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) return undefined;

  let best: any | undefined;
  let bestScore = 0;
  for (const product of products) {
    const nameWords = normalize(product.name).split(/\s+/);
    const score = queryWords.filter((w) => nameWords.some((n: string) => n.startsWith(w))).length;
    if (score > bestScore) {
      best = product;
      bestScore = score;
    }
  }
  return bestScore >= Math.ceil(queryWords.length / 2) ? best : undefined;
}

async function callGroq(messages: any[], withTools = false) {
  const apiKey = process.env.GROQ_API_KEY || '';
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

  const payload: any = {
    model,
    messages,
    max_tokens: 1024,
    temperature: 0.5,
  };

  if (model.includes('gpt-oss')) {
    payload.reasoning_effort = 'low';
  }

  if (withTools) {
    payload.tools = TOOLS;
    payload.tool_choice = 'auto';
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const dto = await req.json();
    const mappedHistory = (dto.history || []).map((h: any) => ({
      role: h.role === 'model' ? 'assistant' : h.role,
      content: typeof h.parts === 'string' ? h.parts : h.parts?.[0]?.text || '',
    }));

    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...mappedHistory,
      { role: 'user', content: dto.message },
    ];

    const response = await callGroq(messages, true);
    const messageResult = response.choices?.[0]?.message;

    if (!messageResult?.tool_calls || messageResult.tool_calls.length === 0) {
      return NextResponse.json({
        type: 'message',
        message: messageResult?.content || '',
      });
    }

    const toolCall = messageResult.tool_calls[0];
    const fnName = toolCall?.function?.name;
    const args = JSON.parse(toolCall?.function?.arguments || '{}');
    const pool = getPool();

    if (fnName === 'get_order_status') {
      const cleanedOrderId = String(args.orderId || '').trim().replace(/^#/, '');
      let order: any = null;

      const exactRes = await pool.query(
        'SELECT * FROM public."Order" WHERE "id" = $1 LIMIT 1',
        [cleanedOrderId],
      );
      if (exactRes.rows.length > 0) {
        order = exactRes.rows[0];
      } else if (dto.userId) {
        const userOrdersRes = await pool.query(
          'SELECT * FROM public."Order" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
          [dto.userId],
        );
        const normalized = cleanedOrderId.toLowerCase();
        order = userOrdersRes.rows.find((o) => o.id.toLowerCase().startsWith(normalized));
      }

      if (!order) {
        return NextResponse.json({
          type: 'message',
          message:
            'No pude encontrar información sobre esa orden. Verifica el número e intenta de nuevo.',
        });
      }

      const followUp = await callGroq([
        ...messages,
        { role: 'assistant', tool_calls: [toolCall] },
        {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            status: order.status,
            restaurantName: order.restaurantName,
          }),
        },
      ]);

      return NextResponse.json({
        type: 'message',
        message: followUp.choices?.[0]?.message?.content || '',
      });
    }

    if (fnName === 'add_product_to_cart') {
      const productsRes = await pool.query(
        'SELECT * FROM "restaurant_service"."Product" ORDER BY "createdAt" DESC',
      );
      const match = findClosestProduct(productsRes.rows, String(args.productName || ''));

      if (!match) {
        return NextResponse.json({
          type: 'message',
          message: `No encontré ningún producto parecido a "${args.productName}" en el menú.`,
        });
      }

      const quantity =
        Number.isFinite(args.quantity) && Number(args.quantity) > 0 ? Number(args.quantity) : 1;

      const restRes = await pool.query(
        'SELECT * FROM "restaurant_service"."Restaurant" WHERE "id" = $1 LIMIT 1',
        [match.restaurantId],
      );
      const hoursRes = await pool.query(
        'SELECT * FROM "restaurant_service"."OpeningHour" WHERE "restaurantId" = $1',
        [match.restaurantId],
      );

      const restaurant = {
        ...restRes.rows[0],
        openingHours: hoursRes.rows,
      };
      const isOpen = checkIsOpen(restaurant);

      if (!isOpen) {
        return NextResponse.json({
          type: 'message',
          message: `${restaurant.name} está cerrado en este momento y no puede recibir pedidos. Intenta más tarde o pídeme algo de otra tienda.`,
        });
      }

      const followUp = await callGroq([
        ...messages,
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
      ]);

      return NextResponse.json({
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
        message: followUp.choices?.[0]?.message?.content || '',
      });
    }

    return NextResponse.json({
      type: 'message',
      message: 'No pude entender qué acción realizar. ¿Podrías reformular tu mensaje?',
    });
  } catch (error: any) {
    console.error('Error en POST /api/ai/chat:', error);
    return NextResponse.json({
      type: 'message',
      message:
        'Tuve un problema para procesar tu mensaje. ¿Podrías intentarlo de nuevo en un momento?',
    });
  }
}

