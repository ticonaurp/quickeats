import { createClient } from '@supabase/supabase-js';

// 🔑 Extraemos las credenciales. Ponemos textos de relleno para que GitHub no rompa al compilar.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url-for-build.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';

// Validamos si de verdad faltan en el entorno real (local o producción)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("⚠️ [Supabase Realtime] Faltan configurar las variables de entorno de Supabase.");
}

// Inicialización de la instancia única del cliente (ahora blindada contra strings vacíos)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);