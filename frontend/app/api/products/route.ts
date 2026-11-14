import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getPool } from '../_lib/db';

export async function GET(req: NextRequest) {
  try {
    const restaurantId = req.nextUrl.searchParams.get('restaurantId');
    const pool = getPool();

    const res = restaurantId
      ? await pool.query(
          'SELECT * FROM "restaurant_service"."Product" WHERE "restaurantId" = $1 ORDER BY "createdAt" DESC',
          [restaurantId],
        )
      : await pool.query(
          'SELECT * FROM "restaurant_service"."Product" ORDER BY "createdAt" DESC',
        );

    return NextResponse.json(res.rows);
  } catch (error: any) {
    console.error('Error en GET /api/products:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener productos' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const pool = getPool();
    const id = crypto.randomUUID();

    const res = await pool.query(
      `INSERT INTO "restaurant_service"."Product"
       ("id", "name", "description", "price", "category", "calories", "image", "isAvailable", "isPopular", "restaurantId", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      [
        id,
        data.name,
        data.description || '',
         parseFloat(data.price),
        data.category || 'General',
        data.calories ? parseInt(String(data.calories), 10) : null,
        data.image || '',
        data.isAvailable ?? true,
        data.isPopular ?? false,
        data.restaurantId,
      ],
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error en POST /api/products:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al crear el producto' },
      { status: 500 },
    );
  }
}

