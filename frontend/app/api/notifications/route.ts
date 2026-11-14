import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getPool } from '../_lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, message } = body || {};

    const pool = getPool();
    const id = crypto.randomUUID();

    const res = await pool.query(
      `INSERT INTO "notification_service"."Notification"
       ("id", "userId", "message", "isRead", "createdAt")
       VALUES ($1, $2, $3, false, NOW())
       RETURNING *`,
      [id, userId, message],
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/notifications:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al crear la notificación' },
      { status: 500 },
    );
  }
}

