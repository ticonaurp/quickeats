'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';
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
    let isMounted = true;

    async function loadRestaurants() {
      try {
        const data = await fetchFromGateway('/restaurants');
        if (isMounted && data && Array.isArray(data)) {
          setRestaurants(data);
        }
      } catch (error) {
        console.error("Error updating restaurants in dashboard:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRestaurants();

    const interval = setInterval(() => {
      loadRestaurants();
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ⚡ 2. ESCUCHA REALTIME (Cambios instantáneos vía WebSockets de Supabase)
  useEffect(() => {
    if (!supabase) return;

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
          if (!payload.new && !payload.old) return;

          if (payload.eventType === 'UPDATE') {
            const updatedDoc = payload.new as Restaurant;
            if (updatedDoc && updatedDoc.id) {
              setRestaurants((prev) =>
                prev.map((r) => (r.id === updatedDoc.id ? { ...r, ...updatedDoc } : r))
              );
            }
          }

          if (payload.eventType === 'INSERT') {
            const newDoc = payload.new as Restaurant;
            if (newDoc && newDoc.id) {
              setRestaurants((prev) => [newDoc, ...prev]);
            }
          }

          if (payload.eventType === 'DELETE') {
            const oldDoc = payload.old as { id: string };
            if (oldDoc && oldDoc.id) {
              setRestaurants((prev) => prev.filter((r) => r.id !== oldDoc.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔍 Lógica de filtrado seguro en memoria
  const filtered = restaurants.filter((r: Restaurant) => {
    if (!r || !r.name || !r.description) return false;
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  const openRestaurants = filtered.filter((r: Restaurant) => r.isOpen);
  const closedRestaurants = filtered.filter((r: Restaurant) => !r.isOpen);
  const expressRestaurants = openRestaurants.filter((r: Restaurant) => r.deliveryTime <= 30);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <TopNavbar />

      {/* Header Hero Modernizado */}
      <div className="bg-linear-to-br from-emerald-600 via-green-500 to-emerald-500 px-6 pt-12 pb-20 relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-6">
            <p className="text-green-50/90 text-sm font-medium tracking-wide">Hola, bienvenido de nuevo 👋</p>
            <h1 className="text-white mt-1.5 font-black text-3xl sm:text-4xl tracking-tight leading-none">
              ¿Qué vas a pedir hoy?
            </h1>
          </div>
          
          {/* Input de búsqueda estilo Glassmorphism */}
          <div className="w-full max-w-2xl flex items-center gap-3 bg-white/15 border border-white/20 backdrop-blur-md rounded-2xl px-4 py-4 focus-within:bg-white focus-within:border-white focus-within:shadow-lg focus-within:shadow-green-900/20 transition-all duration-300 group">
            <Search size={20} className="text-white group-focus-within:text-green-600 shrink-0 transition-colors" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar marcas, restaurantes o platillos favoritos..."
              className="flex-1 bg-transparent outline-none text-white group-focus-within:text-slate-800 placeholder-white/70 group-focus-within:placeholder-slate-400 text-sm md:text-base font-medium"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white group-focus-within:bg-slate-100 group-focus-within:text-slate-500 text-sm transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cuerpo principal de la app */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        
        {/* Contenedor Horizontal de Categorías con Scroll Invisible */}
        <div className="mb-10">
          <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 font-bold text-sm border shadow-xs ${
                activeCategory === 'all' 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10' 
                  : 'bg-white text-slate-600 border-slate-100 hover:border-green-500/40 hover:text-green-600'
              }`}
            >
              🔥 Todos
            </button>
            {LOCAL_CATEGORIES && LOCAL_CATEGORIES.map((cat: { id: string; name: string; emoji: string }) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 font-bold text-sm border shadow-xs ${
                  activeCategory === cat.id 
                    ? 'bg-green-500 text-white border-green-500 shadow-md shadow-green-500/20' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-green-500/40 hover:text-green-600'
                }`}
              >
                <span className="text-base">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Renderizado Condicional: Skeletons Animados vs Contenido Real */}
        {loading ? (
          <div className="mb-12">
            <div className="h-6 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-4 border border-slate-100 space-y-4 animate-pulse">
                  <div className="w-full h-44 bg-slate-200 rounded-2xl" />
                  <div className="h-5 bg-slate-200 rounded-md w-2/3" />
                  <div className="h-4 bg-slate-200 rounded-md w-full" />
                  <div className="flex justify-between pt-2">
                    <div className="h-6 bg-slate-200 rounded-md w-1/4" />
                    <div className="h-6 bg-slate-200 rounded-md w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Carrusel de Entrega Rápida */}
            {!search && activeCategory === 'all' && expressRestaurants.length > 0 && (
              <div className="mb-10">
                <ExpressDeliveryCarousel
                  restaurants={expressRestaurants}
                  onSelect={(id) => router.push(`/restaurants/${id}`)}
                />
              </div>
            )}

            {/* Catálogo de Restaurantes */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-black text-slate-900 text-xl tracking-tight sm:text-2xl">
                    {search ? `Resultados para "${search}"` : 'Todos los restaurantes'}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                    Descubre los mejores sabores cerca de ti
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-100 rounded-xl shadow-xs shrink-0">
                  <SlidersHorizontal size={14} className="text-slate-400" />
                  <span className="text-slate-600 text-xs font-bold">{openRestaurants.length} activos</span>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-xl mx-auto px-6">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UtensilsCrossed size={28} className="text-amber-500" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg">No se encontraron tiendas</h3>
                  <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
                    Intenta cambiar los filtros de categoría o revisa la ortografía de tu búsqueda.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Bloque 1: Restaurantes Abiertos */}
                  {openRestaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {openRestaurants.map((r: Restaurant) => (
                        <RestaurantCard
                          key={`open-${r.id}`}
                          r={r}
                          onClick={() => router.push(`/restaurants/${r.id}`)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Bloque 2: Restaurantes Cerrados */}
                  {closedRestaurants.length > 0 && (
                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <h3 className="text-slate-400 text-xs font-bold tracking-wider uppercase">
                          Cerrados por el momento
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {closedRestaurants.map((r: Restaurant) => (
                          <div
                            key={`closed-${r.id}`}
                            className="opacity-60 saturate-50 pointer-events-none transition-all duration-300 select-none"
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