// app/login/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from './../components/Navbar';
import { LoginForm } from './../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar superior completa */}
      <Navbar />

      {/* Contenedor de Pantalla Dividida */}
      <main className="flex flex-1 flex-col lg:flex-row">
        
        {/* PANEL IZQUIERDO: Bloque verde (Fuentes más grandes) */}
        <div className="hidden lg:flex w-1/2 bg-[#22C55E] items-center justify-center p-12 relative overflow-hidden">
          <div className="text-center text-white relative z-10 max-w-lg">
            {/* Contenedor del Logo Q */}
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <span className="font-black text-5xl text-white font-poppins">Q</span>
            </div>
            
            {/* Textos de Bienvenida (Aumentados) */}
            <h2 className="text-5xl font-black mb-4 font-poppins tracking-tight">¡Bienvenido de nuevo!</h2>
            <p className="text-green-100 text-lg font-normal leading-relaxed">
              Tus restaurantes favoritos están a solo un toque de distancia. Inicia sesión para continuar tu viaje culinario.
            </p>
          </div>

          {/* Decoraciones circulares */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        </div>

        {/* PANEL DERECHO: Formulario de Login (Fuentes más grandes) */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* Enlace de regreso (Aumentado a text-base) */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-base text-gray-400 hover:text-gray-600 mb-8 transition-colors font-medium"
            >
              <ArrowLeft size={18} /> Volver al inicio
            </Link>

            {/* Encabezados (Aumentados) */}
            <h1 className="font-black text-5xl text-gray-900 mb-2 font-poppins tracking-tight">Iniciar sesión</h1>
            <p className="text-gray-500 text-base mb-8">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="font-semibold text-[#22C55E] hover:underline">
                Regístrate gratis
              </Link>
            </p>
            
            {/* Formulario modular */}
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}