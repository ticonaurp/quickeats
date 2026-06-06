"use client"; // ⚠️ Asegúrate que esta sea la línea 1 absoluta del archivo

import { useState, useEffect } from 'react';
import { Store } from 'lucide-react';

// 🔄 Cambiamos a rutas absolutas usando el alias @/
import { Sidebar } from '@/app/admin/components/Sidebar'; 
import { RestaurantHeader } from '@/app/admin/restaurants/components/RestaurantHeader';
import { SearchBar } from '@/app/admin/restaurants/components/SearchBar';
import { RestaurantTable } from '@/app/admin/restaurants/components/RestaurantTable';
import { RestaurantMobileList } from '@/app/admin/restaurants/components/RestaurantMobileList';

// 📐 Interfaz para que TypeScript entienda la estructura exacta de tu Restaurante
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); // ✅ Arreglo tipado correctamente
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true); 

  // 🔄 Cargar los restaurantes reales desde tu API Gateway al montar la pantalla
  useEffect(() => {
    setMounted(true);

    const loadRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:4000/restaurants');
        const data = await response.json();

        // Mapeo seguro para formatear la data de la base de datos a lo que espera tu Front
        const formattedData = data.map((r: any) => ({
          ...r,
          rating: r.rating ?? 5.0, 
          reviewCount: r.reviewCount ?? 0,
          // Convierte el entero de Prisma (ej. 30) a un texto entendible ('30 min')
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

  // 🔍 Filtro reactivo para la barra de búsqueda (por Nombre o Categoría)
  const filtered = restaurants.filter(r =>
    !search || 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  // 🔒 Cambiar el estado de Abierto/Cerrado persistente en la Base de Datos (PATCH real)
  const handleToggleOpen = async (id: string) => {
    // Buscamos el restaurante actual en el estado para saber en qué valor está
    const targetRestaurant = restaurants.find(r => r.id === id);
    if (!targetRestaurant) return;

    try {
      // Mandamos la actualización parcial mediante PATCH al Gateway (Puerto 4000)
      const response = await fetch(`http://localhost:4000/restaurants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: !targetRestaurant.isOpen }), // Invertimos el estado actual
      });

      if (response.ok) {
        // Si el backend guardó el cambio con éxito, actualizamos la interfaz visualmente
        setRestaurants(prev => 
          prev.map(r => r.id === id ? { ...r, isOpen: !r.isOpen } : r)
        );
      } else {
        console.error("El backend rechazó la actualización del estado.");
        alert("No se pudo cambiar el estado del restaurante en el servidor.");
      }
    } catch (error) {
      console.error("Error de red al intentar hacer toggle de apertura:", error);
      alert("Error de conexión con el Gateway al cambiar estado.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
      
      {/* Menú de navegación lateral */}
      <Sidebar />

      {/* Área central de administración */}
      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-4">
        
        {/* Contador dinámico en la cabecera */}
        <RestaurantHeader total={restaurants.length} />
        
        {/* Input de búsqueda funcional */}
        <SearchBar value={search} onChange={setSearch} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Pantalla de carga limpia */}
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm font-medium animate-pulse">Conectando con el Gateway y cargando restaurantes...</p>
            </div>
          ) : (
            <>
              {/* Vistas dinámicas conectadas por Props */}
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