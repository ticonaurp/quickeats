"use client";

import Link from 'next/navigation'; // 💡 Cambiado a next/link nativo en la compilación si usas Next 13+
import LinkComponent from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutGrid, Store, Package, ClipboardList, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { getUserEmail } from '@/app/services/auth';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string>('admin@quickeats.com');

  // Mostramos el email real del administrador con sesión activa
  useEffect(() => {
    const current = getUserEmail();
    if (current) setEmail(current);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Sesión cerrada con éxito. ¡Vuelve pronto!');
    router.push('/login');
  };

  const menuItems = [
    { label: 'Panel de Control', icon: LayoutGrid, href: '/admin' },
    { label: 'Restaurantes', icon: Store, href: '/admin/restaurants' },
    { label: 'Productos', icon: Package, href: '/admin/products' },
    { label: 'Pedidos', icon: ClipboardList, href: '/admin/orders' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col justify-between p-4 sticky top-0 font-sans antialiased shrink-0 select-none">
      {/* Top: Logo y Perfil */}
      <div className="space-y-6">
        {/* Logo Corporativo Unificado */}
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="w-8 h-8 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl font-poppins shadow-md shadow-orange-500/10">
            Q
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tight font-poppins">
            Quick<span className="text-amber-500">Eats</span>
          </span>
        </div>

        {/* Badge de Perfil de Administrador con paleta Mango 🥭 */}
        <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-100/40">
          <p className="text-[10px] font-black tracking-widest text-amber-700 uppercase">Panel Admin</p>
          <p className="text-xs font-semibold text-amber-600 truncate mt-0.5">{email}</p>
        </div>

        {/* Bloque de Navegación */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // ⚡ Coincidencia exacta o si es subruta (ej. /admin/products/new activa "Productos")
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <LinkComponent
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 relative group ${
                  isActive
                    ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/10 scale-102'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 transition-colors'} />
                <span>{item.label}</span>
                
                {/* Indicador estético discreto a la derecha si está inactivo en hover */}
                {!isActive && (
                  <span className="absolute right-3 w-1 h-1 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </LinkComponent>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Cierre de Sesión */}
      <div className="border-t border-slate-100 pt-4 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black text-red-500 hover:bg-red-50 transition-all duration-200 group"
        >
          <LogOut size={18} className="text-red-400 group-hover:translate-x-0.5 transition-transform" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}