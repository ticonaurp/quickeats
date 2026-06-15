"use client";

import { useState, useEffect } from 'react';
import { Store, AlertCircle } from 'lucide-react'; 
import { Sidebar } from '../components/Sidebar'; 
import { RestaurantHeader } from './components/RestaurantHeader';
import { SearchBar } from './components/SearchBar';
import { RestaurantTable } from './components/RestaurantTable';
import { RestaurantMobileList } from './components/RestaurantMobileList';

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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); 
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  // 🌐 Base URL dinámica para el componente (Render o Local)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // ⏱️ EFECTO DINÁMICO: Carga inicial + Polling continuo en segundo plano
  useEffect(() => {
    setMounted(true);

    const loadRestaurants = async () => {
      try {
        // Mantenemos el error en null para re-intentos limpios de red
        setError(null); 
        const response = await fetch(`${baseUrl}/restaurants`); 
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error del servidor (Código ${response.status})`);
        }

        const rawData = await response.json();

        // 🔍 CONTROL DE QA: Imprimimos en la consola del navegador la respuesta exacta para auditarla
        console.log("🔍 [QA AUDIT] Respuesta cruda del Gateway:", rawData);

        let realRestaurantsArray: any[] = [];

        // 🛡️ EXTRACTOR AUTOMÁTICO DE ARREGLOS (Soporta cualquier estructura de backend)
        if (Array.isArray(rawData)) {
          realRestaurantsArray = rawData; 
        } else if (rawData && typeof rawData === 'object') {
          const potentialArray = Object.values(rawData).find(val => Array.isArray(val));
          if (potentialArray) {
            realRestaurantsArray = potentialArray as any[];
          } else {
            throw new Error("El formato JSON no contiene ningún arreglo de restaurantes válido.");
          }
        } else {
          throw new Error("La respuesta del servidor no es un objeto JSON válido.");
        }

        // 🚀 Mapeo ultra-seguro
        const formattedData = realRestaurantsArray.map((r: any) => ({
          ...r,
          reviewCount: r.reviewCount ?? 0,
          deliveryTime: typeof r.deliveryTime === 'number' ? `${r.deliveryTime} min` : (r.deliveryTime ?? '30 min'),
          image: r.image ?? ''
        }));

        setRestaurants(formattedData);
      } catch (error: any) {
        console.error("❌ Error en el flujo de integración:", error);
        setError(error.message || "No se pudo establecer conexión con el servidor backend.");
      } finally {
        setLoading(false); // Apaga el esqueleto de carga inicial la primera vez
      }
    };

    // 1. Ejecución inmediata al cargar o montar la vista
    loadRestaurants();

    // 2. ⏱️ CONFIGURACIÓN DEL INTERVALO: Re-consulta al Gateway silenciosamente cada 1.5 segundos
    const interval = setInterval(() => {
      loadRestaurants();
    }, 500);

    // 3. 🧹 LIMPIEZA AUTOMÁTICA: Apaga el temporizador si el administrador navega a otra sección del panel
    return () => clearInterval(interval);
  }, [baseUrl]);

  const filtered = restaurants.filter(r =>
    !search || 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  // 🔄 Cambiado a función asíncrona con persistencia real en base de datos (Optimistic Update)
  const handleToggleOpen = async (id: string) => {
    const targetRestaurant = restaurants.find(r => r.id === id);
    if (!targetRestaurant) return;

    const nextStatus = !targetRestaurant.isOpen;

    // 1. Actualización Optimista en el UI
    setRestaurants(prev => 
      prev.map(r => r.id === id ? { ...r, isOpen: nextStatus } : r)
    );

    try {
      // 2. Petición PATCH al API Gateway (Solo mandamos la propiedad mutada)
      const response = await fetch(`${baseUrl}/restaurants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado en el backend.');
      }
    } catch (error) {
      console.error("❌ Error actualizando el estado en el servidor:", error);
      alert("No se pudo guardar el cambio en la base de datos. Verificando conexión...");
      
      // 3. Fallback/Rollback: Si el servidor falla, revertimos el interruptor al estado original
      setRestaurants(prev => 
        prev.map(r => r.id === id ? { ...r, isOpen: !nextStatus } : r)
      );
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
      
      <Sidebar />

      <main className="flex-1 p-8 max-w-350 mx-auto w-full space-y-4">
        
        <RestaurantHeader total={restaurants.length} />
        
        <SearchBar value={search} onChange={setSearch} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm font-medium animate-pulse">Conectando con el Gateway y cargando restaurantes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4 bg-red-50/50 text-red-600">
              <AlertCircle size={40} className="mx-auto mb-3 text-red-400 stroke-[1.5]" />
              <p className="text-sm font-semibold mb-1">Error de integración en el Backend</p>
              <p className="text-xs text-red-500 max-w-md mx-auto font-mono bg-white p-3 rounded-lg border border-red-100 shadow-2xl mt-2">
                {error}
              </p>
            </div>
          ) : (
            <>
              <RestaurantTable data={filtered} onToggleOpen={handleToggleOpen} />
              <RestaurantMobileList data={filtered} onToggleOpen={handleToggleOpen} />
            </>
          )}

          {!loading && !error && filtered.length === 0 && (
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