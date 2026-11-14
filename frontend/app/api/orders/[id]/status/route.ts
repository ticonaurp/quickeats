import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../../_lib/db';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body || {};

    const pool = getPool();
    const updateRes = await pool.query(
      'UPDATE public."Order" SET "status" = $1 WHERE "id" = $2 RETURNING *',
      [status, id],
    );

    if (updateRes.rows.length === 0) {
      return NextResponse.json(
        { message: 'La orden que intentas actualizar no existe.' },
        { status: 404 },
      );
    }

    const itemsRes = await pool.query(
      'SELECT * FROM public."OrderItem" WHERE "orderId" = $1',
      [id],
    );

    return NextResponse.json({
      ...updateRes.rows[0],
      items: itemsRes.rows,
    });
  } catch (error: any) {
    console.error('Error en PATCH /api/orders/[id]/status:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al actualizar el estado de la orden' },
      { status: 500 },
    );
  }
}

