// components/Navbar.tsx
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 font-sans antialiased select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Logo a la izquierda con Identidad Unificada */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-base font-poppins shadow-md shadow-orange-500/10 transition-transform group-hover:scale-105">
            Q
          </div>
          <span className="font-black text-xl text-slate-900 font-poppins tracking-tight">
            Quick<span className="text-amber-500 group-hover:text-orange-500 transition-colors duration-200">Eats</span>
          </span>
        </Link>

        {/* Botones de acción a la derecha basados en el Mango Theme */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            href="/login" 
            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors duration-200"
          >
            Iniciar Sesión
          </Link>
          
          <Link 
            href="/register" 
            className="text-sm font-black bg-linear-to-r from-amber-500 to-orange-500 text-white px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/10 transition-all duration-200 transform hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
          >
            Empezar
          </Link>
        </div>
      </div>
    </nav>
  );
}