import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getPool, checkIsOpen } from '../_lib/db';

export async function GET() {
  try {
    const pool = getPool();
    const ordersRes = await pool.query(
      'SELECT * FROM public."Order" ORDER BY "createdAt" DESC',
    );
    const itemsRes = await pool.query('SELECT * FROM public."OrderItem"');

    const itemsByOrder = new Map<string, any[]>();
    for (const item of itemsRes.rows) {
      const list = itemsByOrder.get(item.orderId) || [];
      list.push(item);
      itemsByOrder.set(item.orderId, list);
    }

    const orders = ordersRes.rows.map((o) => ({
      ...o,
      items: itemsByOrder.get(o.id) || [],
    }));

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error en GET /api/orders:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener las órdenes' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      restaurantId,
      restaurantName,
      address,
      deliveryNotes,
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
      items = [],
    } = body || {};

    const pool = getPool();

    // 1. Verificar que el restaurante exista y esté abierto
    const restRes = await pool.query(
      'SELECT * FROM "restaurant_service"."Restaurant" WHERE "id" = $1 LIMIT 1',
      [restaurantId],
    );

    if (restRes.rows.length === 0) {
      return NextResponse.json(
        { message: 'El restaurante de este pedido ya no existe.' },
        { status: 404 },
      );
    }

    const hoursRes = await pool.query(
      'SELECT * FROM "restaurant_service"."OpeningHour" WHERE "restaurantId" = $1',
      [restaurantId],
    );

    const restaurantWithHours = {
      ...restRes.rows[0],
      openingHours: hoursRes.rows,
    };

    if (!checkIsOpen(restaurantWithHours)) {
      return NextResponse.json(
        {
          message: `${restaurantWithHours.name ?? 'Este restaurante'} está cerrado en este momento y no puede recibir pedidos.`,
        },
        { status: 400 },
      );
    }

    // 2. Crear la orden
    const orderId = crypto.randomUUID();
    const orderInsert = await pool.query(
      `INSERT INTO public."Order"
       ("id", "userId", "restaurantId", "restaurantName", "address", "deliveryNotes", "paymentMethod", "subtotal", "deliveryFee", "total", "status", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', NOW())
       RETURNING *`,
      [
        orderId,
        userId,
        restaurantId,
        restaurantName || restaurantWithHours.name || 'Restaurante',
        address,
        deliveryNotes ?? null,
        paymentMethod || 'CARD',
        Number(subtotal) || 0,
        Number(deliveryFee) || 0,
        Number(total) || 0,
      ],
    );

    const insertedItems: any[] = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        const itemId = crypto.randomUUID();
        const itemRes = await pool.query(
          `INSERT INTO public."OrderItem"
           ("id", "orderId", "productId", "name", "price", "quantity")
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            itemId,
            orderId,
            item.productId,
            item.name,
            Number(item.price) || 0,
            Number(item.quantity) || 1,
          ],
        );
        insertedItems.push(itemRes.rows[0]);
      }
    }

    // 3. Crear notificación automática
    try {
      await pool.query(
        `INSERT INTO "notification_service"."Notification"
         ("id", "userId", "message", "isRead", "createdAt")
         VALUES ($1, $2, $3, false, NOW())`,
        [crypto.randomUUID(), userId, 'Tu orden ha sido creada exitosamente'],
      );
    } catch (notifErr) {
      console.error('No se pudo crear la notificación de la orden:', notifErr);
    }

    return NextResponse.json(
      {
        ...orderInsert.rows[0],
        items: insertedItems,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error en POST /api/orders:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al crear la orden' },
      { status: 500 },
    );
  }
}

