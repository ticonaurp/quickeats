import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getPool, checkIsOpen } from '../../_lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const pool = getPool();

    const restRes = await pool.query(
      'SELECT * FROM "restaurant_service"."Restaurant" WHERE "id" = $1 LIMIT 1',
      [id],
    );

    if (restRes.rows.length === 0) {
      return NextResponse.json(
        { message: `El restaurante con ID ${id} no existe.` },
        { status: 404 },
      );
    }

    const hoursRes = await pool.query(
      'SELECT * FROM "restaurant_service"."OpeningHour" WHERE "restaurantId" = $1',
      [id],
    );

    const restaurant = {
      ...restRes.rows[0],
      openingHours: hoursRes.rows,
    };

    return NextResponse.json({
      ...restaurant,
      isOpen: checkIsOpen(restaurant),
    });
  } catch (error: any) {
    console.error('Error en GET /api/restaurants/[id]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener el restaurante' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const pool = getPool();

    const existingRes = await pool.query(
      'SELECT * FROM "restaurant_service"."Restaurant" WHERE "id" = $1 LIMIT 1',
      [id],
    );

    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { message: `El restaurante con ID ${id} no existe.` },
        { status: 404 },
      );
    }

    const existing = existingRes.rows[0];
    const { openingHours, ...rest } = body || {};

    const updatedRes = await pool.query(
      `UPDATE "restaurant_service"."Restaurant"
       SET "name" = $1,
           "description" = $2,
           "category" = $3,
           "address" = $4,
           "deliveryTime" = $5,
           "deliveryFee" = $6,
           "isOpen" = $7,
           "isFeatured" = $8,
           "image" = $9
       WHERE "id" = $10
       RETURNING *`,
      [
        rest.name ?? existing.name,
        rest.description ?? existing.description,
        rest.category ?? existing.category,
        rest.address ?? existing.address,
        rest.deliveryTime !== undefined ? Number(rest.deliveryTime) : existing.deliveryTime,
        rest.deliveryFee !== undefined ? Number(rest.deliveryFee) : existing.deliveryFee,
        rest.isOpen !== undefined ? Boolean(rest.isOpen) : existing.isOpen,
        rest.isFeatured !== undefined ? Boolean(rest.isFeatured) : existing.isFeatured,
        rest.image ?? existing.image,
        id,
      ],
    );

    let finalHours: any[] = [];
    if (Array.isArray(openingHours)) {
      await pool.query(
        'DELETE FROM "restaurant_service"."OpeningHour" WHERE "restaurantId" = $1',
        [id],
      );
      for (const h of openingHours) {
        const hId = crypto.randomUUID();
        const hRes = await pool.query(
          `INSERT INTO "restaurant_service"."OpeningHour"
           ("id", "dayOfWeek", "openTime", "closeTime", "restaurantId")
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [hId, Number(h.dayOfWeek), String(h.openTime), String(h.closeTime), id],
        );
        finalHours.push(hRes.rows[0]);
      }
    } else {
      const hoursRes = await pool.query(
        'SELECT * FROM "restaurant_service"."OpeningHour" WHERE "restaurantId" = $1',
        [id],
      );
      finalHours = hoursRes.rows;
    }

    const updatedRestaurant = {
      ...updatedRes.rows[0],
      openingHours: finalHours,
    };

    return NextResponse.json({
      ...updatedRestaurant,
      isOpen: checkIsOpen(updatedRestaurant),
    });
  } catch (error: any) {
    console.error('Error en PATCH /api/restaurants/[id]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al actualizar el restaurante' },
      { status: 500 },
    );
  }
}

