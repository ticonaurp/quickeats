'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, Bike, Zap } from 'lucide-react';
import { LOCAL_CATEGORIES, Restaurant } from '../data/mockData';
import { supabase } from '../services/supabase';
import { fetchFromGateway } from '../services/api';
import TopNavbar from '../components/TopNavbar';
import RestaurantCard from '../components/shared/RestaurantCard';
import ExpressDeliveryCarousel from '../components/home/ExpressDeliveryCarousel';
import HowItWorksBanner from '../components/home/HowItWorksBanner';


export const dynamic = 'force-dynamic';

export default function UserPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🌐 1. CONSULTA DINÁMICA & POLLING (Sincronización base cada 4 segundos)
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await fetchFromGateway('/restaurants');
        if (data && Array.isArray(data)) {
          setRestaurants(data);
        }
      } catch (error) {
        console.error("Error updating restaurants in dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();

    const interval = setInterval(() => {
      loadRestaurants();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // ⚡ 2. ESCUCHA REALTIME (Cambios instantáneos vía WebSockets de Supabase)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'restaurant_service',
          table: 'Restaurant',
        },
        (payload) => {
          console.log('⚡ [Realtime Change Detected]:', payload);

          if (payload.eventType === 'UPDATE') {
            const updatedDoc = payload.new as Restaurant;
            setRestaurants((prev) =>
              prev.map((r) => (r.id === updatedDoc.id ? { ...r, ...updatedDoc } : r))
            );
          }

          if (payload.eventType === 'INSERT') {
            const newDoc = payload.new as Restaurant;
            setRestaurants((prev) => [newDoc, ...prev]);
          }

          if (payload.eventType === 'DELETE') {
            const oldDoc = payload.old as { id: string };
            setRestaurants((prev) => prev.filter((r) => r.id !== oldDoc.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔍 Lógica de filtrado dinámico en memoria
  const filtered = restaurants.filter((r: Restaurant) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  const openRestaurants = filtered.filter((r: Restaurant) => r.isOpen);
  const closedRestaurants = filtered.filter((r: Restaurant) => !r.isOpen);
  const expressRestaurants = openRestaurants.filter((r: Restaurant) => r.deliveryTime <= 30);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <TopNavbar />

      {/* Header Hero */}
      <div className="bg-linear-to-br from-[#22C55E] to-[#16A34A] px-6 pt-12 pb-16">
        <div className="max-w-360 mx-auto">
          <div className="mb-6">
            <p className="text-green-50/90 text-[0.875rem]">Hola, <span className="text-white font-bold">Alex</span> 👋</p>
            <h1 className="text-white mt-1 font-extrabold text-[1.75rem] sm:text-[2.3rem] tracking-tight leading-none">¿Qué vas a pedir hoy?</h1>
          </div>
          <div className="w-full max-w-2xl flex items-center gap-3 bg-white/20 border border-white/20 backdrop-blur-xs rounded-2xl px-4 py-3.5 focus-within:bg-white/25 focus-within:border-white transition-all">
            <Search size={18} className="text-white/80 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar restaurantes o comidas..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/70 text-[0.92rem]"
            />
            {search && <button onClick={() => setSearch('')} className="text-white/80 hover:text-white text-xl">×</button>}
          </div>
        </div>
      </div>

      <div className="max-w-360 mx-auto px-4 sm:px-6 -mt-7">
        {/* Categorías */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {LOCAL_CATEGORIES.map((cat: { id: string; name: string; emoji: string }) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all shrink-0 border ${activeCategory === cat.id ? 'bg-[#22C55E] text-white border-[#22C55E]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#22C55E]/40'
                  }`}
                style={{ fontWeight: 600, fontSize: '0.85rem' }}
              >
                <span className="text-[1.1rem]">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white rounded-3xl border border-gray-100 shadow-xs mb-12">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Cargando restaurantes de la zona...</p>
          </div>
        ) : (
          <>
            {/* Carrusel de Entrega Rápida */}
            {!search && activeCategory === 'all' && expressRestaurants.length > 0 && (
              <ExpressDeliveryCarousel
                restaurants={expressRestaurants}
                onSelect={(id) => router.push(`/restaurants/${id}`)}
              />
            )}

            {/* Catálogo de Restaurantes */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-[#0F172A] text-[1.1rem] tracking-tight">
                  {search ? `Resultados para "${search}"` : 'Todos los restaurantes'}
                </h2>
                <span className="text-gray-400 text-[0.8rem] font-medium">{openRestaurants.length} disponibles</span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-xs">
                  <span className="text-3xl block mb-2">🍽️</span>
                  <p className="text-gray-700 font-bold">No encontramos resultados para tu búsqueda</p>
                </div>
              ) : (
                <div className="space-y-9">
                  {/* Restaurantes abiertos */}
                  {openRestaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {openRestaurants.map((r: Restaurant, index) => (
                        <RestaurantCard
                          key={r.id || `open-${index}`} // 🎯 Key blindado
                          r={r}
                          onClick={() => router.push(`/restaurants/${r.id}`)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Cerrados ahora (Bloqueados dinámicamente de forma segura) */}
                  {closedRestaurants.length > 0 && (
                    <div className="pt-4">
                      <p className="text-gray-400 text-[0.75rem] font-bold tracking-wider uppercase mb-4">Cerrados ahora</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {closedRestaurants.map((r: Restaurant, index) => (
                          <div
                            key={r.id || `closed-${index}`} // 🎯 Key blindado
                            className="opacity-55 saturate-50 pointer-events-none transition-all duration-300 select-none"
                          >
                            <RestaurantCard
                              r={r}
                              onClick={() => { }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {!search && activeCategory === 'all' && <HowItWorksBanner />}
      </div>
    </div>
  );
}