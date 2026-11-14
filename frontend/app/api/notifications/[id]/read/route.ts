import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../../_lib/db';

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const pool = getPool();

    const res = await pool.query(
      'UPDATE "notification_service"."Notification" SET "isRead" = true WHERE "id" = $1 RETURNING *',
      [id],
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { message: 'La notificación que intentas actualizar no existe.' },
        { status: 404 },
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error('Error en PATCH /api/notifications/[id]/read:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al marcar notificación como leída' },
      { status: 500 },
    );
  }
}

