import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../_lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const pool = getPool();

    const orderRes = await pool.query(
      'SELECT * FROM public."Order" WHERE "id" = $1 LIMIT 1',
      [id],
    );

    if (orderRes.rows.length === 0) {
      return NextResponse.json(
        { message: 'La orden solicitada no existe.' },
        { status: 404 },
      );
    }

    const itemsRes = await pool.query(
      'SELECT * FROM public."OrderItem" WHERE "orderId" = $1',
      [id],
    );

    return NextResponse.json({
      ...orderRes.rows[0],
      items: itemsRes.rows,
    });
  } catch (error: any) {
    console.error('Error en GET /api/orders/[id]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener la orden' },
      { status: 500 },
    );
  }
}

