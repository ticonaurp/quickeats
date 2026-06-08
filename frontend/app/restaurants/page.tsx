'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFromGateway } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  products?: Product[];
}

export default function RestaurantsPage() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        // 🔥 Consumimos el listado global a través del API Gateway (3001)
        const data = await fetchFromGateway('/restaurants');
        setRestaurants(data || []);
      } catch (err: any) {
        setErrorMsg('No se pudo conectar con el API Gateway o no estás autenticado.');
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Barra de Navegación Superior */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold text-orange-600 tracking-tight">QuickEats 🍔</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg px-3 py-2 transition-colors bg-white shadow-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurantes Disponibles</h1>
          <p className="text-gray-500 mt-1 text-sm">Explora los mejores menús seleccionados para ti en Lima.</p>
        </header>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Cargando menú delicioso...</p>
          </div>
        ) : (
          <section className="space-y-12">
            {restaurants.length === 0 && !errorMsg ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                <p className="text-gray-400 text-base">No hay restaurantes registrados en la base de datos.</p>
              </div>
            ) : (
              restaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  {/* Info del Restaurante */}
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{restaurant.name}</h2>
                    <p className="text-gray-500 mt-1 text-sm">{restaurant.description}</p>
                  </div>

                  {/* Grid de Productos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!restaurant.products || restaurant.products.length === 0 ? (
                      <p className="text-xs text-gray-400 italic col-span-full">Este restaurante aún no tiene platillos en su carta.</p>
                    ) : (
                      restaurant.products.map((product) => (
                        <div key={product.id} className="border border-gray-100 bg-gray-50/50 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                          <div>
                            <h3 className="font-bold text-gray-800 text-base">{product.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                          </div>
                          <div className="mt-5 flex items-center justify-between">
                            <span className="text-orange-600 font-extrabold text-lg">S/. {product.price.toFixed(2)}</span>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors">
                              Agregar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}