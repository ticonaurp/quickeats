import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '../../_lib/db';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const cookieToken = req.cookies.get('access_token')?.value || null;
  const token = bearerToken || cookieToken;

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Tienes acceso al perfil protegido',
    user: {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    },
  });
}

