// 🔐 Utilidades para leer la información del usuario a partir del token JWT
// El backend (auth-service) firma el token con el payload: { sub, email, role }
// donde "sub" es el id único del usuario en la base de datos.

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Decodifica el payload del JWT sin necesidad de librerías externas
function decodeToken(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    // El JWT usa base64url; lo convertimos a base64 estándar antes de decodificar
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(json) as JwtPayload;
  } catch (error) {
    console.error('No se pudo decodificar el token JWT:', error);
    return null;
  }
}

// Devuelve el id del usuario autenticado (o null si no hay sesión válida)
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = decodeToken(token);
  return payload?.sub ?? null;
}

// Devuelve el email del usuario autenticado (o null si no hay sesión válida)
export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  const payload = decodeToken(token);
  return payload?.email ?? null;
}
