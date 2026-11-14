import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getPool } from '../../_lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Todos los campos son obligatorios' },
        { status: 400 },
      );
    }

    const pool = getPool();
    const existing = await pool.query('SELECT "id" FROM public."User" WHERE "email" = $1 LIMIT 1', [
      email,
    ]);

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { message: 'El correo ya está registrado' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    const insertRes = await pool.query(
      `INSERT INTO public."User" ("id", "name", "email", "password", "role", "createdAt")
       VALUES ($1, $2, $3, $4, 'USER', NOW())
       RETURNING "id", "name", "email", "role", "createdAt"`,
      [id, name, email, hashedPassword],
    );

    const user = insertRes.rows[0];
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        message: 'Usuario registrado con éxito',
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error en POST /api/auth/register:', error);
    return NextResponse.json(
      { message: error?.message || 'Error al registrar el usuario' },
      { status: 500 },
    );
  }
}

