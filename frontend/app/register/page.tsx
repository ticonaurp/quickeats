// app/register/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { RegisterForm } from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar superior completa */}
      <Navbar />

      {/* Contenedor de Pantalla Dividida */}
      <main className="flex flex-1 flex-col lg:flex-row">
        
        {/* PANEL IZQUIERDO: Mensajes de beneficios */}
        <div className="hidden lg:flex w-1/2 bg-[#22C55E] items-center justify-center p-12 relative overflow-hidden">
          <div className="text-white relative z-10 max-w-lg">
            
            {/* Títulos de Bienvenida */}
            <h2 className="text-5xl font-black mb-4 font-poppins tracking-tight">Únete a QuickEats</h2>
            <p className="text-green-100 text-lg font-normal leading-relaxed mb-10">
              Regístrate en segundos y comienza a pedir de los mejores restaurantes cerca de ti.
            </p>
            
            {/* Lista de características */}
            <ul className="space-y-5 text-lg font-medium text-green-50">
              <li className="flex items-center gap-3">
                <span className="text-xl">✅</span> Regístrate gratis — sin tarjeta de crédito
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">🏷️</span> Tiempo de entrega promedio de 30 min
              </li>
            </ul>
          </div>

          {/* Decoraciones circulares de fondo */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        </div>

        {/* PANEL DERECHO: Formulario de Registro */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 bg-white">
          <div className="max-w-md w-full mx-auto">
            
            {/* Enlace de regreso */}
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-base text-gray-400 hover:text-gray-600 mb-8 transition-colors font-medium"
            >
              <ArrowLeft size={18} /> Volver al inicio
            </Link>

            {/* Encabezados */}
            <h1 className="font-black text-5xl text-gray-900 mb-2 font-poppins tracking-tight">Crear cuenta</h1>
            <p className="text-gray-500 text-base mb-8">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-semibold text-[#22C55E] hover:underline">
                Inicia sesión
              </Link>
            </p>
            
            {/* Formulario modular de registro */}
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}