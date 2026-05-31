// components/Navbar.tsx
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo a la izquierda */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="font-bold text-xl text-gray-900 font-poppins">QuickEats</span>
        </Link>

        {/* Botones a la derecha */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            href="/login" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-medium bg-green-500 text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-colors hover:scale-105"
          >
            Empezar
          </Link>
        </div>
      </div>
    </nav>
  );
}