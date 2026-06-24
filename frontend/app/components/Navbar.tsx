// components/Navbar.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, ClipboardList, LogOut } from 'lucide-react';
import { getUserEmail } from '../services/auth';

export function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserEmail(getUserEmail());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setDropdownOpen(false);
    setUserEmail(null);
    router.push('/login');
  };

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
          {userEmail ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <span className="w-7 h-7 rounded-full bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-xs shrink-0">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-bold text-slate-700 max-w-35 truncate hidden sm:inline">
                  {userEmail}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 py-2 z-50">
                  <p className="px-4 py-1.5 text-xs font-bold text-slate-400 truncate sm:hidden">{userEmail}</p>
                  <Link
                    href="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    <ClipboardList size={16} />
                    Mis Pedidos
                  </Link>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
