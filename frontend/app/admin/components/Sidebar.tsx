"use client";

import LinkComponent from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutGrid, Store, Package, ClipboardList, LogOut, Menu, PanelLeftClose } from 'lucide-react';
import { toast } from 'sonner';
import { getUserEmail } from '@/app/services/auth';

const menuItems = [
  { label: 'Panel de Control', icon: LayoutGrid, href: '/admin' },
  { label: 'Restaurantes', icon: Store, href: '/admin/restaurants' },
  { label: 'Productos', icon: Package, href: '/admin/products' },
  { label: 'Pedidos', icon: ClipboardList, href: '/admin/orders' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string>('admin@quickeats.com');
  const [collapsed, setCollapsed] = useState(false);
  const [animate, setAnimate] = useState(false); // habilita la transición SOLO tras montar

  // Email real del admin + preferencia de colapso persistida (para que no "salte" al navegar).
  useEffect(() => {
    const current = getUserEmail();
    if (current) setEmail(current);
    if (localStorage.getItem('admin_sidebar_collapsed') === 'true') setCollapsed(true);
    // Activamos la animación en el siguiente frame, ya aplicado el estado de colapso,
    // así el colapso inicial al cargar/navegar NO se anima (evita el "salto" visual).
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('admin_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleLogout = () => {
    // Limpiamos TODAS las claves de sesión (consistente con el Navbar del cliente).
    ['token', 'role', 'isLoggedIn', 'email', 'userId', 'name'].forEach((k) => localStorage.removeItem(k));
    toast.success('Sesión cerrada con éxito. ¡Vuelve pronto!');
    router.push('/login');
  };

  return (
    <div
      className={`${collapsed ? 'w-20' : 'w-64'} ${animate ? 'transition-all duration-300 ease-in-out' : ''} h-screen bg-white border-r border-slate-100 flex flex-col justify-between p-4 sticky top-0 font-sans antialiased shrink-0 select-none`}
    >
      {/* Top: Logo / Toggle / Perfil / Navegación */}
      <div className="space-y-6">
        {/* Cabecera: logo + botón hamburguesa */}
        <div className={`flex ${collapsed ? 'flex-col gap-3' : 'items-center justify-between'} px-1 py-1`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 shrink-0 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg font-poppins shadow-md shadow-orange-500/10">
              Q
            </div>
            {!collapsed && (
              <span className="font-black text-xl text-slate-900 tracking-tight font-poppins whitespace-nowrap">
                Quick<span className="text-amber-500">Eats</span>
              </span>
            )}
          </div>

          <button
            onClick={toggleCollapsed}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
          >
            {collapsed ? <Menu size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Badge de Perfil de Administrador */}
        {collapsed ? (
          <div className="flex justify-center" title={email}>
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
              {email.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-100/40">
            <p className="text-[10px] font-black tracking-widest text-amber-700 uppercase">Panel Admin</p>
            <p className="text-xs font-semibold text-amber-600 truncate mt-0.5">{email}</p>
          </div>
        )}

        {/* Bloque de Navegación */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Coincidencia exacta o subruta (ej. /admin/products/new activa "Productos")
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <LinkComponent
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-bold transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 transition-colors'}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </LinkComponent>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Cierre de Sesión */}
      <div className="border-t border-slate-100 pt-4">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Cerrar Sesión' : undefined}
          className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 transition-all duration-200 group`}
        >
          <LogOut size={18} className="text-red-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}
