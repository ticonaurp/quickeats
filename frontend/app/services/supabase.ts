import { createClient } from '@supabase/supabase-js';

// 🔑 Extraemos las credenciales. Ponemos textos de relleno para que GitHub no rompa al compilar.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url-for-build.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';

// ✅ Bandera: ¿hay credenciales REALES de Supabase? (false si se usó el placeholder del build).
// Se usa para NO intentar conectar el WebSocket de Realtime cuando las variables no se inyectaron
// al compilar (p. ej. el build de Azure/Kubernetes), evitando errores en consola. El catálogo
// igual se actualiza por el polling al Gateway.
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!isSupabaseConfigured) {
  console.warn('⚠️ [Supabase Realtime] Variables de entorno de Supabase no inyectadas en el build; Realtime desactivado (se usa polling).');
}

// Inicialización de la instancia única del cliente (ahora blindada contra strings vacíos)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);