import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getPool, checkIsOpen } from '../_lib/db';

export async function GET() {
  try {
    const pool = getPool();
    const restRes = await pool.query(
      'SELECT * FROM "restaurant_service"."Restaurant" ORDER BY "createdAt" DESC',
    );
    const hoursRes = await pool.query(
      'SELECT * FROM "restaurant_service"."OpeningHour"',
    );

    const hoursByRest = new Map<string, any[]>();
    for (const h of hoursRes.rows) {
      const list = hoursByRest.get(h.restaurantId) || [];
      list.push(h);
      hoursByRest.set(h.restaurantId, list);
    }

    const restaurants = restRes.rows.map((r) => {
      const withHours = {
        ...r,
        openingHours: hoursByRest.get(r.id) || [],
      };
      return {
        ...withHours,
        isOpen: checkIsOpen(withHours),
      };
    });

    return NextResponse.json(restaurants);
  } catch (error: any) {
    console.error('Error en GET /api/restaurants:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener restaurantes' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      category,
      address,
      deliveryTime,
      deliveryFee,
      isOpen = true,
      isFeatured = false,
      image,
      openingHours = [],
    } = body || {};

    const pool = getPool();
    const id = crypto.randomUUID();

    const insertRes = await pool.query(
      `INSERT INTO "restaurant_service"."Restaurant"
       ("id", "name", "description", "category", "address", "deliveryTime", "deliveryFee", "isOpen", "isFeatured", "image", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       RETURNING *`,
      [
        id,
        name,
        description || '',
        category || 'General',
        address || '',
        Number(deliveryTime) || 30,
        Number(deliveryFee) || 0,
        Boolean(isOpen),
        Boolean(isFeatured),
        image || '',
      ],
    );

    const insertedHours: any[] = [];
    if (Array.isArray(openingHours)) {
      for (const h of openingHours) {
        const hId = crypto.randomUUID();
        const hRes = await pool.query(
          `INSERT INTO "restaurant_service"."OpeningHour"
           ("id", "dayOfWeek", "openTime", "closeTime", "restaurantId")
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [hId, Number(h.dayOfWeek), String(h.openTime), String(h.closeTime), id],
        );
        insertedHours.push(hRes.rows[0]);
      }
    }

    const restaurant = {
      ...insertRes.rows[0],
      openingHours: insertedHours,
    };

    return NextResponse.json(
      { ...restaurant, isOpen: checkIsOpen(restaurant) },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error en POST /api/restaurants:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al crear el restaurante' },
      { status: 500 },
    );
  }
}

