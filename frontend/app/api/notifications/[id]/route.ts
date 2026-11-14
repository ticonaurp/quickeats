import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../_lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: userId } = await context.params;
    const pool = getPool();

    const res = await pool.query(
      'SELECT * FROM "notification_service"."Notification" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
      [userId],
    );

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error('Error en GET /api/notifications/[userId]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener notificaciones' },
      { status: 500 },
    );
  }
}

