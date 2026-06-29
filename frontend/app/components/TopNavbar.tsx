'use client';

import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, ChevronDown, LogOut, Bell, CheckCheck, Package } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { getUserEmail, getUserId } from '../services/auth';

interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Tiempo relativo amigable ("hace 5 min", "hace 2 h", "12 jun").
function formatRelative(dateStr: string): string {
  const t = new Date(dateStr).getTime();
  if (isNaN(t)) return '';
  const min = Math.floor((Date.now() - t) / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
}

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Resaltado del enlace activo según la ruta actual.
  const isRestaurantsActive = pathname === '/user' || pathname.startsWith('/restaurants');
  const isOrdersActive = pathname.startsWith('/orders');

  useEffect(() => {
    setUserEmail(getUserEmail());
  }, []);

  // 🔔 Notificaciones del usuario autenticado (carga inicial + refresco cada 15s).
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    let active = true;
    async function loadNotifications() {
      try {
        const response = await fetch(`${baseUrl}/notifications/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (active && Array.isArray(data)) setNotifications(data);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    }

    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
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

  // Ordenamos por fecha (más recientes primero) y tomamos las últimas 6.
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const unreadCount = sortedNotifications.filter((n) => !n.isRead).length;
  const latestNotifications = sortedNotifications.slice(0, 6);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch(`${baseUrl}/notifications/${id}/read`, { method: 'PATCH' });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await Promise.all(
      unread.map((n) =>
        fetch(`${baseUrl}/notifications/${n.id}/read`, { method: 'PATCH' }).catch(() => {})
      )
    );
  };

  const handleLogout = () => {
    // Limpiamos TODA la sesión (consistente con el resto de la app).
    ['token', 'role', 'isLoggedIn', 'email', 'userId', 'name'].forEach((k) => localStorage.removeItem(k));
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 font-sans antialiased sticky top-0 z-40">
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

        {/* Centro: Navegación con resaltado activo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push('/user')}
            className={`relative font-semibold text-[0.92rem] transition-colors ${
              isRestaurantsActive ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'
            }`}
          >
            Restaurantes
            {isRestaurantsActive && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => router.push('/orders')}
            className={`relative font-semibold text-[0.92rem] transition-colors ${
              isOrdersActive ? 'text-amber-500' : 'text-gray-500 hover:text-amber-500'
            }`}
          >
            Ordenes
            {isOrdersActive && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-amber-500" />
            )}
          </button>
        </div>

        {/* Derecha: Notificaciones, Carrito y Perfil */}
        <div className="flex items-center gap-5">

          {/* 🔔 Notificaciones */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 text-gray-600 hover:text-amber-500 transition-colors"
              aria-haspopup="true"
              aria-expanded={notifOpen}
            >
              <Bell size={20} className="stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full leading-none ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 z-50 overflow-hidden">
                {/* Cabecera */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-black text-slate-800">
                    Notificaciones{unreadCount > 0 && <span className="text-amber-500"> ({unreadCount})</span>}
                  </p>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <CheckCheck size={13} /> Marcar todas
                    </button>
                  )}
                </div>

                {/* Lista */}
                <div className="max-h-80 overflow-y-auto">
                  {latestNotifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2">
                        <Bell size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">No tienes notificaciones</p>
                    </div>
                  ) : (
                    latestNotifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-slate-50 border-b border-slate-50 last:border-0 ${
                          n.isRead ? '' : 'bg-amber-50/40'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            n.isRead ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600'
                          }`}
                        >
                          <Package size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm leading-snug ${n.isRead ? 'text-slate-500' : 'text-slate-800 font-semibold'}`}>
                            {n.message}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{formatRelative(n.createdAt)}</p>
                        </div>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 🛒 Carrito */}
          <button
            onClick={() => router.push('/cart')}
            className="relative p-2 text-gray-600 hover:text-amber-500 transition-colors"
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
