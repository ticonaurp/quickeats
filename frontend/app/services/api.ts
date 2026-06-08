const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchFromGateway(endpoint: string, options?: RequestInit) {
  // Capturamos el token JWT si el usuario ya se logueó
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Usamos la clase nativa Headers para evitar conflictos de indexación en TypeScript
  const headers = new Headers(options?.headers);
  
  // Establecemos el Content-Type por defecto si no viene uno ya definido
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Si existe un token, lo inyectamos de forma segura
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers, // Pasamos el objeto Headers nativo estructurado
    });

    // Manejo seguro por si la respuesta no es JSON (ej. respuestas vacías del gateway)
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || `Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Error en API [${endpoint}]:`, error);
    throw error;
  }
}