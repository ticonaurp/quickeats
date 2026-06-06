"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Store, Package, ClipboardList, LogOut, ChevronLeft } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Panel de Control', icon: LayoutGrid, href: '/admin' },
    { label: 'Restaurantes', icon: Store, href: '/admin/restaurants' },
    { label: 'Productos', icon: Package, href: '/admin/products' },
    { label: 'Pedidos', icon: ClipboardList, href: '/admin/orders' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between p-4 sticky top-0">
      {/* Top: Logo y Perfil */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-black text-xl">Q</div>
          <span className="font-black text-xl text-gray-900 font-sans tracking-tight">
            Quick<span className="text-green-500">Eats</span>
          </span>
        </div>

        <div className="bg-green-50/60 rounded-xl p-3 border border-green-100/50">
          <p className="text-xs font-bold text-green-800">Panel Admin</p>
          <p className="text-xs text-green-600 truncate">admin@quickeats.com</p>
        </div>

        {/* Navegación */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-500 text-white shadow-sm shadow-green-500/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Acciones de salida */}
      <div className="border-t border-gray-100 pt-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}