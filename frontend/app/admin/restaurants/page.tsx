"use client";

import { useState, useEffect } from 'react';
import { Store } from 'lucide-react';
import { Sidebar } from '../components/Sidebar'; 
import { RestaurantHeader } from './components/RestaurantHeader';
import { SearchBar } from './components/SearchBar';
import { RestaurantTable } from './components/RestaurantTable';
import { RestaurantMobileList } from './components/RestaurantMobileList';

// 1. 💡 AGREGA ESTA INTERFAZ AQUÍ ARRIBA (Para que TypeScript conozca la estructura)
interface Restaurant {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  image: string;
}

export default function RestaurantsPage() {
  const [search, setSearch] = useState('');
  
  // 2. 🔑 CAMBIA ESTA LÍNEA: Ahora le decimos que guardará un arreglo de tipo Restaurant
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); 
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    setMounted(true);

    const loadRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:4000/restaurants');
        const data = await response.json();

        const formattedData = data.map((r: any) => ({
          ...r,
          reviewCount: r.reviewCount ?? 0,
          deliveryTime: typeof r.deliveryTime === 'number' ? `${r.deliveryTime} min` : r.deliveryTime,
          image: r.image 
        }));

        setRestaurants(formattedData);
      } catch (error) {
        console.error("Error al conectar con el Gateway:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const filtered = restaurants.filter(r =>
    !search || 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Con el useState tipado, este map ya no dará error de tipos
  const handleToggleOpen = (id: string) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, isOpen: !r.isOpen } : r));
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
      
      <Sidebar />

      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-4">
        
        <RestaurantHeader total={restaurants.length} />
        
        <SearchBar value={search} onChange={setSearch} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm font-medium animate-pulse">Conectando con el Gateway y cargando restaurantes...</p>
            </div>
          ) : (
            <>
              <RestaurantTable data={filtered} onToggleOpen={handleToggleOpen} />
              <RestaurantMobileList data={filtered} onToggleOpen={handleToggleOpen} />
            </>
          )}

          {/* Estado de Búsqueda Vacía */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white">
              <Store size={40} className="mx-auto mb-3 text-gray-300 stroke-[1.5]" />
              <p className="text-sm font-medium">No se encontraron restaurantes registrados.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}