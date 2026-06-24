// 🔐 Utilidades para el control de sesión en el cliente (QuickEats V2)
// Nota: El token JWT real viaja protegido en una Cookie HttpOnly invisible a atacantes XSS.

export function isTokenValid(): boolean {
  if (typeof window === 'undefined') return false;

  // Leemos la bandera que inyecta el LoginForm corregido
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  // Si no existe o no es el string "true", la sesión no es válida
  if (!isLoggedIn || isLoggedIn !== 'true') {
    return false;
  }

  return true;
}

// Devuelve el id del usuario autenticado mapeado en el inicio de sesión
export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Retorna el ID real guardado por el login o un fallback limpio por seguridad del DTO
  return localStorage.getItem('userId') || 'user-id-fallback';
}

// Devuelve el email del usuario autenticado
export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('email') || 'usuario@quickeats.com';
}

// Extrae el rol normalizado en mayúsculas
export function getUserRole(): string {
  if (typeof window === 'undefined') return 'USER';
  return (localStorage.getItem('role') || 'USER').toUpperCase();
}