'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { LoginForm } from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden">
      <style jsx global>{`
        @keyframes marquee-fast {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes marquee-slow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-fast { animation: marquee-fast 24s linear infinite; }
        .animate-wave-reverse { animation: marquee-reverse 28s linear infinite; }
        .animate-wave-slow { animation: marquee-slow 34s linear infinite; }
      `}</style>

      <Navbar />

      <main className="flex min-h-[calc(100vh-4rem)] relative">
        {/* === PANEL IZQUIERDO - VERSIÓN LIGHT MANGO === */}
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center border-r border-slate-800">

          {/* Sutil resplandor de fondo color mango (muy suave) */}
          <div className="absolute inset-0 bg-[radial-gradient(at_30%_30%,rgba(245,158,11,0.1)_0%,transparent_60%)]" />

          <div className="relative w-full rotate-[-4deg] scale-[1.12] flex flex-col gap-5">

            {/* Fila 1 - Comidas en Gris Tenue */}
            <div className="overflow-hidden whitespace-nowrap flex min-w-full">
              <div className="animate-wave-fast flex shrink-0 text-5xl xl:text-6xl font-black tracking-[-2px] text-slate-700 uppercase select-none">
                BURGER • CEVICHE • PIZZA • LOMO • SUSHI • TACOS • MAKI • POLLO • CHIFA •&nbsp;
              </div>
              <div className="animate-wave-fast flex shrink-0 text-5xl xl:text-6xl font-black tracking-[-2px] text-slate-700 uppercase select-none">
                BURGER • CEVICHE • PIZZA • LOMO • SUSHI • TACOS • MAKI • POLLO • CHIFA •&nbsp;
              </div>
            </div>

            {/* Fila 2 - Marca con Gradiente Mango Enérgico */}
            <div className="overflow-hidden whitespace-nowrap flex min-w-full py-3 bg-amber-500/5 border-y border-amber-500/10">
              <div className="animate-wave-reverse flex shrink-0 text-7xl xl:text-8xl font-black tracking-[-3px] bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent uppercase select-none">
                QUICKEATS • LIVE • SPEED • PREMIUM •&nbsp;
              </div>
              <div className="animate-wave-reverse flex shrink-0 text-7xl xl:text-8xl font-black tracking-[-3px] bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent uppercase select-none">
                QUICKEATS • LIVE • SPEED • PREMIUM •&nbsp;
              </div>
            </div>

            {/* Fila 3 - Outline Mango Sutil */}
            <div className="overflow-hidden whitespace-nowrap flex min-w-full">
              <div className="animate-wave-slow flex shrink-0 text-6xl xl:text-7xl font-black tracking-[-2px] text-transparent uppercase select-none"
                   style={{ WebkitTextStroke: '1.5px rgba(245, 158, 11, 0.35)' }}>
                DELIVERY • ANTOJO • RÁPIDO • FRESCO • LOCAL • SABOR •&nbsp;
              </div>
              <div className="animate-wave-slow flex shrink-0 text-6xl xl:text-7xl font-black tracking-[-2px] text-transparent uppercase select-none"
                   style={{ WebkitTextStroke: '1.5px rgba(245, 158, 11, 0.35)' }}>
                DELIVERY • ANTOJO • RÁPIDO • FRESCO • LOCAL • SABOR •&nbsp;
              </div>
            </div>
          </div>

        </div>

        {/* === PANEL DERECHO - FORMULARIO === */}
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
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-slate-900 mb-2">
                Bienvenido de nuevo
              </h1>
              <p className="text-slate-500 text-base">
                Inicia sesión y pide como un rey
              </p>
            </div>

            {/* Contenedor del formulario */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-100 border border-slate-100 p-1">
              <LoginForm />
            </div>

            {/* Enlace a registro */}
            <p className="text-center text-sm text-slate-500 mt-8">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="font-bold text-amber-600 hover:text-amber-700 transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}