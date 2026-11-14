import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../../_lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const pool = getPool();

    const ordersRes = await pool.query(
      'SELECT * FROM public."Order" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
      [userId],
    );

    if (ordersRes.rows.length === 0) {
      return NextResponse.json([]);
    }

    const orderIds = ordersRes.rows.map((o) => o.id);
    const itemsRes = await pool.query(
      'SELECT * FROM public."OrderItem" WHERE "orderId" = ANY($1::text[])',
      [orderIds],
    );

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
    console.error('Error en GET /api/orders/user/[userId]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener órdenes del usuario' },
      { status: 500 },
    );
  }
}

