import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Navbar } from './../components/Navbar';
import { LoginForm } from './../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-900">
      {/* Navbar superior integrada */}
      <Navbar />

      {/* Contenedor de Pantalla Dividida */}
      <main className="flex flex-1 flex-col lg:flex-row relative">
        
        {/* 🎨 PANEL IZQUIERDO: Bloque Premium Inmersivo */}
        <div className="hidden lg:flex w-1/2 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 items-center justify-center p-16 relative overflow-hidden border-r border-slate-800">
          {/* Patrón de fondo tecnológico sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12)_1px,transparent_1px)] bg-size-[20px_20px] opacity-70" />
          <div className="absolute -top-40 -right-40 w-125 h-125 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-87.5 h-87.5 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10 max-w-md space-y-6">
            {/* Contenedor del Logo Q con Glassmorphism Premium */}
            <div className="w-24 h-24 bg-white/[0.07] backdrop-blur-md rounded-[28px] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl relative group transition-transform duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-linear-to-tr from-green-500/20 to-transparent rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-black text-5xl bg-linear-to-b from-white to-slate-200 bg-clip-text text-transparent font-poppins tracking-tighter select-none">
                Q
              </span>
            </div>
            
            {/* Textos de Bienvenida */}
            <h2 className="text-4xl font-black text-white font-poppins tracking-tight leading-tight">
              Tus antojos,<br />
              <span className="bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">a un clic de distancia.</span>
            </h2>
            <p className="text-slate-400 text-base font-medium leading-relaxed max-w-sm mx-auto">
              Inicia sesión para acceder a tus restaurantes favoritos, realizar un seguimiento en tiempo real y disfrutar de ofertas exclusivas de Lima.
            </p>
          </div>
        </div>

        {/* 📋 PANEL DERECHO: Formulario de Login Limpio */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 lg:px-24 py-16 bg-white relative">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Enlace de regreso con micro-interacción */}
            <div>
              <Link 
                href="/" 
                className="group inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-800 transition-colors font-semibold"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Volver al inicio
              </Link>
            </div>

            {/* Encabezados del Formulario */}
            <div className="space-y-2.5">
              <h1 className="font-black text-4xl text-slate-900 font-poppins tracking-tight flex items-center gap-2">
                Iniciar sesión
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                ¿Nuevo en QuickEats?{' '}
                <Link href="/register" className="font-bold text-green-600 hover:text-green-500 transition-colors underline underline-offset-4 decoration-green-500/30 hover:decoration-green-500">
                  Regístrate gratis
                </Link>
              </p>
            </div>
            
            {/* Contenedor del Formulario Modular */}
            <div className="bg-white rounded-3xl border border-transparent sm:border-slate-100 sm:p-2 sm:shadow-xs">
              <LoginForm />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}