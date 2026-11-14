import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../../_lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const pool = getPool();
    const res = await pool.query(
      'SELECT * FROM "restaurant_service"."Product" WHERE "id" = $1 LIMIT 1',
      [id],
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { message: `Producto con ID ${id} no encontrado` },
        { status: 404 },
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error('Error en GET /api/products/[id]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al obtener producto' },
      { status: 500 },
    );
  }
}

async function handleUpdate(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const data = await req.json();
    const pool = getPool();

    const existingRes = await pool.query(
      'SELECT * FROM "restaurant_service"."Product" WHERE "id" = $1 LIMIT 1',
      [id],
    );

    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { message: `Error al actualizar: El producto ${id} no existe` },
        { status: 404 },
      );
    }

    const existing = existingRes.rows[0];

    const res = await pool.query(
      `UPDATE "restaurant_service"."Product"
       SET "name" = $1,
           "description" = $2,
           "price" = $3,
           "category" = $4,
           "calories" = $5,
           "image" = $6,
           "isAvailable" = $7,
           "isPopular" = $8,
           "restaurantId" = $9
       WHERE "id" = $10
       RETURNING *`,
      [
        data.name ?? existing.name,
        data.description !== undefined ? data.description || '' : existing.description,
        data.price !== undefined ? parseFloat(data.price) : existing.price,
        data.category ?? existing.category,
        data.calories !== undefined
          ? data.calories
            ? parseInt(String(data.calories), 10)
            : null
          : existing.calories,
        data.image ?? existing.image,
        data.isAvailable !== undefined ? Boolean(data.isAvailable) : existing.isAvailable,
        data.isPopular !== undefined ? Boolean(data.isPopular) : existing.isPopular,
        data.restaurantId ?? existing.restaurantId,
        id,
      ],
    );

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error('Error en PUT/PATCH /api/products/[id]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al actualizar el producto' },
      { status: 500 },
    );
  }
}

export const PUT = handleUpdate;
export const PATCH = handleUpdate;

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const pool = getPool();
    const res = await pool.query(
      'DELETE FROM "restaurant_service"."Product" WHERE "id" = $1 RETURNING *',
      [id],
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { message: `Error al eliminar: El producto con ID ${id} no existe en el sistema` },
        { status: 404 },
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error('Error en DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al eliminar el producto' },
      { status: 500 },
    );
  }
}

