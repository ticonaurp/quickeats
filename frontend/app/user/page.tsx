'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, ShoppingBag, MapPin, Search, Pizza } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado en el navegador
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      toast.error('Acceso denegado. Por favor, inicia sesión.');
      router.push('/login');
    } else {
      setUserRole(role);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Sesión cerrada con éxito. ¡Vuelve pronto!');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500 rounded-xl text-white">
              <Pizza size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              QuickEats
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-xl text-sm font-medium text-gray-700">
              <User size={16} className="text-gray-500" />
              <span>Rol: {userRole || 'USER'}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-all"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Encabezado de Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            ¡Hola de nuevo! 🍔
          </h1>
          <p className="text-gray-500 text-base">
            ¿Qué se te antoja ordenar el día de hoy en QuickEats?
          </p>
        </div>

        {/* Barra de Búsqueda Falsa (Estética) */}
        <div className="relative max-w-xl mb-12">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Busca tus platillos o restaurantes favoritos..."
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm placeholder-gray-400"
          />
        </div>

        {/* Grid de Secciones del Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Historial */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Mis Pedidos</h3>
              <p className="text-gray-500 text-sm">Revisa el estado de tus órdenes en tiempo real y tu historial.</p>
            </div>
            <button
              onClick={() => router.push('/orders')}
              className="mt-6 text-sm font-semibold text-green-600 hover:text-green-700 text-left"
            >
              Ver pedidos →
            </button>
          </div>

          {/* Card 2: Direcciones */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Mis Direcciones</h3>
              <p className="text-gray-500 text-sm">Gestiona tus lugares de entrega frecuentes para pedidos rápidos.</p>
            </div>
            <button className="mt-6 text-sm font-semibold text-green-600 hover:text-green-700 text-left">
              Configurar direcciones →
            </button>
          </div>

          {/* Card 3: Perfil */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-4">
                <User size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Perfil de Usuario</h3>
              <p className="text-gray-500 text-sm">Actualiza tus datos personales, contraseña y validaciones digitales.</p>
            </div>
            <button className="mt-6 text-sm font-semibold text-green-600 hover:text-green-700 text-left">
              Editar perfil →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}