import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada con éxito' });
  response.cookies.delete('access_token');
  return response;
}

