import { createClient } from '@supabase/supabase-js';

// 🔑 Extraemos las credenciales desde las variables de entorno de tu Next.js
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("⚠️ [Supabase Realtime] Faltan configurar las variables de entorno de Supabase.");
}

// Inicialización de la instancia única del cliente
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);  