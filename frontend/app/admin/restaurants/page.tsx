"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Store, AlertCircle, RefreshCw } from 'lucide-react'; 
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

// Imagen de respaldo cuando un restaurante tiene un valor de imagen inválido en la BD.
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80';

// Un src válido debe ser una URL http(s) o una ruta absoluta. Si no, devolvemos el fallback.
// Sin esto, valores basura (ej. "d", "dw") hacían que el navegador pidiera /admin/d → 404.
const safeImage = (img: unknown): string =>
  typeof img === 'string' && (img.startsWith('http') || img.startsWith('/')) ? img : FALLBACK_IMG;

export default function RestaurantsPage() {
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]); 
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [isSyncing, setIsSyncing] = useState(false); // Indicador visual sutil para polling posterior

  // 🛡️ Semáforo para evitar colisiones en el Polling de alta velocidad
  const isFetchingRef = useRef(false);
  // 🔄 Guardamos el estado actual en una Ref para leerlo dentro del bucle sin recrear el interval
  const restaurantsLengthRef = useRef(0);

  useEffect(() => {
    restaurantsLengthRef.current = restaurants.length;
  }, [restaurants]);

  // 🌐 Base URL dinámica para el componente
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // ⏱️ EFECTO DINÁMICO DE INTEGRACIÓN: Carga inicial + Polling continuo inteligente
  useEffect(() => {
    setMounted(true);

    const loadRestaurants = async (isInitial = false) => {
      // Si la pestaña no está activa, ahorramos recursos del servidor y del cliente
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      if (isFetchingRef.current) return; 
      
      isFetchingRef.current = true;
      if (!isInitial) setIsSyncing(true);

      try {
        if (isInitial) setError(null); 
        const response = await fetch(`${baseUrl}/restaurants`); 
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error del servidor (Código ${response.status})`);
        }

        const rawData = await response.json();
        let realRestaurantsArray: any[] = [];

        // Extractor automático de arreglos robusto
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

        // Mapeo ultra-seguro y formateo numérico coherente
        const formattedData: Restaurant[] = realRestaurantsArray.map((r: any) => ({
          id: r.id,
          name: r.name ?? 'Sin nombre',
          address: r.address ?? 'Dirección no especificada',
          category: r.category ?? 'General',
          rating: Number(r.rating ?? 4.5),
          reviewCount: Number(r.reviewCount ?? 0),
          deliveryTime: typeof r.deliveryTime === 'number' ? `${r.deliveryTime} min` : (r.deliveryTime ?? '30 min'),
          deliveryFee: Number(r.deliveryFee ?? 0),
          isOpen: Boolean(r.isOpen),
          image: safeImage(r.image)
        }));

        setRestaurants(formattedData);
        setError(null); 
      } catch (error: any) {
        console.error("❌ Error en el flujo de integración:", error);
        if (isInitial || !restaurantsLengthRef.current) {
          setError(error.message || "No se pudo establecer conexión con el servidor backend.");
        }
      } finally {
        isFetchingRef.current = false;
        setIsSyncing(false);
        if (isInitial) setLoading(false); 
      }
    };

    // 1. Ejecución inicial limpia
    loadRestaurants(true);

    // 2. ⏱️ POLLING: refresco en silencio cada 15s. (Antes era cada 2s: 30 req/min por admin,
    // golpeaba el Gateway/Supabase sin necesidad; el toggle ya hace optimistic update inmediato.)
    const interval = setInterval(() => {
      loadRestaurants(false);
    }, 15000);

    // 3. 🧹 LIMPIEZA AUTOMÁTICA AL DESMONTAR
    return () => clearInterval(interval);
  }, [baseUrl]); // Quitamos restaurants.length de las dependencias para evitar fugas y re-creaciones

  // 🔍 FILTRADO OPTIMIZADO: Memorizado para evitar lag en inputs
  const filteredRestaurants = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();
    if (!cleanSearch) return restaurants;

    return restaurants.filter(r =>
      r.name.toLowerCase().includes(cleanSearch) || 
      r.category.toLowerCase().includes(cleanSearch)
    );
  }, [search, restaurants]);

  // 🔄 OPTIMISTIC UPDATE ASÍNCRONO
  const handleToggleOpen = async (id: string) => {
    const targetRestaurant = restaurants.find(r => r.id === id);
    if (!targetRestaurant) return;

    const nextStatus = !targetRestaurant.isOpen;

    // Mutación local optimista instantánea
    setRestaurants(prev => 
      prev.map(r => r.id === id ? { ...r, isOpen: nextStatus } : r)
    );

    try {
      const response = await fetch(`${baseUrl}/restaurants/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen: nextStatus }),
      });

      if (!response.ok) throw new Error();
    } catch (error) {
      console.error("❌ Fallback aplicado: Error guardando cambios en el servidor.");
      
      // Rollback inmediato si falla el endpoint del microservicio
      setRestaurants(prev => 
        prev.map(r => r.id === id ? { ...r, isOpen: !nextStatus } : r)
      );
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-slate-900">
      
      <Sidebar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header con indicador discreto de background sync */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <RestaurantHeader total={restaurants.length} />
          {isSyncing && (
            <div className="flex items-center gap-2 self-end sm:self-center text-[11px] text-amber-600 bg-amber-50 font-mono px-3 py-1 rounded-full border border-amber-100 shadow-2xs self-start">
              <RefreshCw size={12} className="animate-spin" />
              <span>Sincronizando live</span>
            </div>
          )}
        </div>
        
        <SearchBar value={search} onChange={setSearch} />

        {/* Contenedor principal alineado al estilo de image_5089db.png */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all">
          
          {loading ? (
            <div className="text-center py-24 text-slate-400">
              <div className="w-9 h-9 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-medium tracking-tight animate-pulse text-slate-500 font-poppins">
                Cargando registros del panel administrativo...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 px-6 bg-rose-50/20 text-rose-600">
              <AlertCircle size={44} className="mx-auto mb-3 text-rose-400 stroke-[1.5]" />
              <h4 className="text-base font-bold font-poppins text-slate-800 mb-1">Error de comunicación</h4>
              <p className="text-xs text-rose-500 max-w-md mx-auto font-mono bg-white p-3 rounded-xl border border-rose-100 shadow-sm mt-3 leading-relaxed">
                {error}
              </p>
            </div>
          ) : (
            <>
              <RestaurantTable data={filteredRestaurants} onToggleOpen={handleToggleOpen} />
              <RestaurantMobileList data={filteredRestaurants} onToggleOpen={handleToggleOpen} />
            </>
          )}

          {!loading && !error && filteredRestaurants.length === 0 && (
            <div className="text-center py-24 text-slate-400 bg-white">
              <Store size={44} className="mx-auto mb-3 text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-700 font-poppins mb-1">Sin coincidencias</p>
              <p className="text-xs text-slate-400">No encontramos ningún comercio con los términos ingresados.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}