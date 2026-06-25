'use client';

import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, ChevronDown, LogOut, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation'; // 1. 🟢 Importamos el enrutador de Next.js
import { getUserEmail, getUserId } from '../services/auth';

interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function TopNavbar() {
  const router = useRouter(); // 2. 🟢 Inicializamos el hook para navegar
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    setUserEmail(getUserEmail());
  }, []);

  // 🔔 Carga inicial de notificaciones del usuario autenticado
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    async function loadNotifications() {
      try {
        const response = await fetch(`${baseUrl}/notifications/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) setNotifications(data);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    }

    loadNotifications();
  }, [baseUrl]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const latestNotifications = notifications.slice(0, 5);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch(`${baseUrl}/notifications/${id}/read`, { method: 'PATCH' });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 font-sans antialiased">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">

        {/* Logo Izquierdo (Cliqueable para volver al inicio) */}
        <div
          onClick={() => router.push('/user')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/10">
            <span className="text-white font-black text-[1.15rem] leading-none select-none font-poppins">
              Q
            </span>
          </div>
          <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">
            Quick<span className="text-amber-500">Eats</span>
          </span>
        </div>

        {/* Centro: Navegación */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push('/user')}
            className="text-[#0F172A] font-semibold text-[0.92rem] hover:text-amber-500 transition-colors"
          >
            Restaurantes
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="text-gray-500 font-medium text-[0.92rem] hover:text-amber-500 transition-colors"
          >
            Ordenes
          </button>
        </div>

        {/* Derecha: Carrito y Perfil */}
        <div className="flex items-center gap-5">

          {/* 🔔 Notificaciones */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 text-gray-600 hover:text-[#0F172A] transition-colors"
              aria-haspopup="true"
              aria-expanded={notifOpen}
            >
              <Bell size={20} className="stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 min-w-4 h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 py-2 z-50">
                <p className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Notificaciones
                </p>
                <div className="h-px bg-slate-100 my-1" />
                {latestNotifications.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-400">No tienes notificaciones.</p>
                ) : (
                  latestNotifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleMarkAsRead(n.id)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 ${
                        n.isRead ? 'opacity-50 text-slate-400' : 'text-slate-700 font-semibold'
                      }`}
                    >
                      {n.message}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 🛒 3. 🟢 BOTÓN DEL CARRITO CON REDIRECCIÓN */}
          <button
            onClick={() => router.push('/cart')}
            className="relative p-2 text-gray-600 hover:text-[#0F172A] transition-colors"
          >
            <ShoppingCart size={20} className="stroke-[2.2]" />
          </button>

          {/* Perfil de Usuario */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer border border-gray-100 rounded-full py-1 pl-1 pr-3 hover:bg-gray-50 transition-colors"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div className="w-8 h-8 bg-linear-to-br from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                {(userEmail?.charAt(0) ?? 'U').toUpperCase()}
              </div>
              <span className="text-[#0F172A] font-semibold text-[0.88rem] tracking-tight max-w-35 truncate">
                {userEmail ?? 'Usuario'}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 py-2 z-50">
                <p className="px-4 py-1.5 text-xs font-bold text-slate-400 truncate">{userEmail ?? 'Usuario'}</p>
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
        </div>

      </div>
    </nav>
  );
}
