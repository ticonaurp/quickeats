import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool, signJwt } from '../../_lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const pool = getPool();
    const res = await pool.query(
      'SELECT "id", "name", "email", "password", "role" FROM public."User" WHERE "email" = $1 LIMIT 1',
      [email],
    );

    const user = res.rows[0];
    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = signJwt({ sub: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: 'Login exitoso',
      name: user.name,
      role: user.role,
      userId: user.id,
      access_token: token,
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error en POST /api/auth/login:', error);
    return NextResponse.json(
      { message: error?.message || 'Error en inicio de sesión' },
      { status: 500 },
    );
  }
}

