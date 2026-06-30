'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Utensils, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { RegisterForm } from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden">
      {/* 🔮 Exclusivo Motor de Animación Operativa (Pulse Delivery Track) */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        @keyframes line-glow {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        .animate-pulse-slow { animation: pulse-slow 7s ease-in-out infinite; }
        .animate-line-glow {
          background-size: 100% 200%;
          animation: line-glow 4s linear infinite;
        }
      `}</style>

      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)] relative">
        
        {/* === PANEL IZQUIERDO: RUTA OPERATIVA FLUIDA (Identidad exclusiva para Registro) === */}
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center border-r border-slate-900 p-12">
          
          {/* Energía radial de la marca */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12)_0%,transparent_65%)]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
          
          <div className="text-white relative z-10 max-w-lg space-y-10">
            {/* Títulos de Bienvenida */}
            <div className="space-y-3">
              <h2 className="text-5xl font-black font-poppins tracking-tight leading-tight">
                Únete a QuickEats
              </h2>
              <p className="text-slate-400 text-base font-medium leading-relaxed">
                Regístrate en segundos y empieza a pedir de los mejores restaurantes de tu zona.
              </p>
            </div>
            
            {/* Contenedor de la Línea de Tiempo de Beneficios */}
            <div className="relative pl-8 space-y-8 select-none">
              
              {/* Eje conductor iluminado de fondo */}
              <div className="absolute left-2.75 top-3 bottom-3 w-0.5 bg-linear-to-b from-amber-500 via-orange-500 to-slate-800 animate-line-glow" />

              {/* Beneficio 1 */}
              <div className="relative flex gap-4 items-start group">
                <div className="absolute -left-7.25 mt-1.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-500/20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-75" />
                </div>
                <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xs flex items-start gap-3.5 flex-1 transform hover:translate-x-1 transition-transform duration-200">
                  <CheckCircle2 size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-sm font-semibold leading-snug">
                    Registros rápidos e inmediatos — sin comisiones ocultas
                  </span>
                </div>
              </div>

              {/* Beneficio 2 */}
              <div className="relative flex gap-4 items-start group">
                <div className="absolute -left-7.25 mt-1.5 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-500/20 flex items-center justify-center" />
                <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xs flex items-start gap-3.5 flex-1 transform hover:translate-x-1 transition-transform duration-200">
                  <Utensils size={20} className="text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-sm font-semibold leading-snug">
                    Acceso directo a la variedad de los mejores locales
                  </span>
                </div>
              </div>

              {/* Beneficio 3 */}
              <div className="relative flex gap-4 items-start group">
                <div className="absolute -left-7.25 mt-1.5 w-3 h-3 rounded-full bg-slate-700 ring-4 ring-slate-700/20 flex items-center justify-center" />
                <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xs flex items-start gap-3.5 flex-1 transform hover:translate-x-1 transition-transform duration-200">
                  <ShieldCheck size={20} className="text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 text-sm font-semibold leading-snug">
                    Pagos seguros y seguimiento de tu pedido en tiempo real.
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* === PANEL DERECHO - FORMULARIO DE REGISTRO === */}
        <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 lg:py-0">
          <div className="w-full max-w-md">
            
            {/* Botón Volver */}
            <Link 
              href="/" 
              className="group inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Volver al Inicio</span>
            </Link>

            <div className="mb-8">
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-slate-900 mb-2 font-poppins">
                Crear cuenta
              </h1>
              <p className="text-slate-500 text-base">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-bold text-amber-500 hover:text-orange-600 hover:underline transition-colors">
                  Inicia sesión
                </Link>
              </p>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-100 border border-slate-100 p-1">
              <RegisterForm />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}