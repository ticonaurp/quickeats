'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, UtensilsCrossed, Sparkles } from 'lucide-react';
import { LOCAL_CATEGORIES, Restaurant } from '../data/mockData';
import { supabase } from '../services/supabase';
import TopNavbar from '../components/TopNavbar';
import RestaurantCard from '../components/shared/RestaurantCard';
import ExpressDeliveryCarousel from '../components/home/ExpressDeliveryCarousel';
import HowItWorksBanner from '../components/home/HowItWorksBanner';

export default function UserPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isFetchingRef = useRef(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // ⏱️ Debounce para la caja de búsqueda (Evita saturar cálculos en memoria)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(handler);
  }, [search]);

  // 🌐 1. POLING SEGURO (Actúa como respaldo silencioso si WebSockets falla)
  useEffect(() => {
    let isMounted = true;
    let timerId: NodeJS.Timeout;

    async function loadRestaurants() {
      if (document.hidden || !isMounted || isFetchingRef.current) return;

      isFetchingRef.current = true;
      try {
        const response = await fetch(`${baseUrl}/restaurants?_t=${Date.now()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted && Array.isArray(data)) {
            setRestaurants(data);
          }
        }
      } catch (error) {
        console.error("Error en sincronización de locales:", error);
      } finally {
        isFetchingRef.current = false;
        if (isMounted) {
          setLoading(false);
          timerId = setTimeout(loadRestaurants, 10000); // Polling de respaldo cada 10s
        }
      }
    }

    loadRestaurants();

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [baseUrl]);

  // ⚡ 2. ESCUCHA REALTIME EFICIENTE VÍA SUPABASE
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'restaurant_service', table: 'Restaurant' },
        (payload) => {
          if (!payload.new && !payload.old) return;

          if (payload.eventType === 'UPDATE') {
            const updatedDoc = payload.new as Restaurant;
            if (updatedDoc?.id) {
              setRestaurants((prev) =>
                prev.map((r) => (r.id === updatedDoc.id ? { ...r, ...updatedDoc } : r))
              );
            }
          }
          if (payload.eventType === 'INSERT') {
            const newDoc = payload.new as Restaurant;
            if (newDoc?.id) setRestaurants((prev) => [newDoc, ...prev]);
          }
          if (payload.eventType === 'DELETE') {
            const oldDoc = payload.old as { id: string };
            if (oldDoc?.id) setRestaurants((prev) => prev.filter((r) => r.id !== oldDoc.id));
          }
        }
      )
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, []);

  // 🔍 3. FILTRADO OPTIMIZADO CON DEBOUNCE
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return restaurants.filter((r: Restaurant) => {
      if (!r?.name || !r?.category) return false;
      
      const matchSearch = !q || 
        r.name.toLowerCase().includes(q) || 
        (r.description && r.description.toLowerCase().includes(q));
        
      const matchCat = activeCategory === 'all' || 
        r.category.toLowerCase() === activeCategory.toLowerCase();
        
      return matchSearch && matchCat;
    });
  }, [restaurants, debouncedSearch, activeCategory]);

  // 📊 4. SEGMENTACIÓN DE CATEGORÍAS Y LOGÍSTICA EXPRESS
  const { openRestaurants, closedRestaurants, expressRestaurants } = useMemo(() => {
    const open = filtered.filter((r: Restaurant) => r.isOpen);
    const closed = filtered.filter((r: Restaurant) => !r.isOpen);
    
    const express = open.filter((r: Restaurant) => {
      const parsedTime = typeof r.deliveryTime === 'number' 
        ? r.deliveryTime 
        : parseInt(String(r.deliveryTime).replace(/\D/g, ''), 10);
        
      return !isNaN(parsedTime) && parsedTime <= 30;
    });

    return { openRestaurants: open, closedRestaurants: closed, expressRestaurants: express };
  }, [filtered]);

  // 🛠️ SOLUCIÓN: Evita duplicar el ID 'all' si ya viene integrado en LOCAL_CATEGORIES
  const categoriesList = useMemo(() => {
    const hasAll = LOCAL_CATEGORIES?.some(cat => cat.id.toLowerCase() === 'all');
    if (hasAll) return LOCAL_CATEGORIES;

    return [
      { id: 'all', name: 'Todos', emoji: '🔥' },
      ...LOCAL_CATEGORIES
    ];
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-amber-500 selection:text-white">
      <TopNavbar />

      {/* Hero Header Corporativo Mango */}
      <div className="bg-linear-to-br from-amber-500 to-orange-600 px-4 sm:px-8 pt-16 pb-28 relative overflow-hidden rounded-b-[2.5rem] shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-xs">
              <Sparkles size={10} className="fill-white" /> Universidad Ricardo Palma
            </span>
            <h1 className="text-white font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight font-poppins">
              ¿Qué te provoca pedir hoy?
            </h1>
          </div>
          
          {/* Input Buscador */}
          <div className="w-full max-w-md flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-xl shadow-orange-950/10 border border-transparent focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all duration-300 group">
            <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 shrink-0 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar platos, locales o antojos..."
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-semibold"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-[10px] transition-colors font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido Base */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-20">
        
        {/* Píldoras de Categorías (Mapeadas de Forma Única y Segura) */}
        <div className="mb-10">
          <div className="flex items-center gap-2.5 overflow-x-auto py-2 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categoriesList.map((cat) => {
              const isSelected = activeCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={`cat-pill-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-200 font-black text-xs uppercase tracking-wider border ${
                    isSelected 
                      ? 'bg-linear-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-orange-500/20 scale-102' 
                      : 'bg-white text-slate-600 border-slate-100 hover:border-amber-400 hover:text-amber-600 shadow-xs'
                  }`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shimmer de Carga */}
        {loading ? (
          <div className="mb-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-5 border border-slate-100 space-y-4 animate-pulse">
                  <div className="w-full h-44 bg-slate-100 rounded-2xl" />
                  <div className="h-5 bg-slate-200 rounded-md w-2/3" />
                  <div className="h-4 bg-slate-100 rounded-md w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="transition-all duration-500">
            {/* Carrusel Express */}
            {!search && activeCategory === 'all' && expressRestaurants.length > 0 && (
              <div className="mb-12">
                <ExpressDeliveryCarousel
                  restaurants={expressRestaurants}
                  onSelect={(id) => router.push(`/restaurants/${id}`)}
                />
              </div>
            )}

            {/* Listado General */}
            <div className="mb-16">
              <div className="flex items-end justify-between mb-8 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-black text-slate-900 text-2xl tracking-tight font-poppins">
                    {search ? `Resultados para "${search}"` : 'Locales Disponibles'}
                  </h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                    Variedad y rapidez directo a tus manos
                  </p>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider border border-slate-200/40">
                  <SlidersHorizontal size={12} className="text-slate-400" />
                  <span>{openRestaurants.length} Abiertos</span>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-xl mx-auto px-6 space-y-3">
                  <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
                    <UtensilsCrossed size={22} />
                  </div>
                  <h3 className="text-slate-800 font-black text-lg font-poppins">Sin resultados</h3>
                  <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto">
                    Prueba cambiando el término de búsqueda o selecciona otra categoría en el menú superior.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Grid de Locales Abiertos */}
                  {openRestaurants.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                      {openRestaurants.map((r: Restaurant) => (
                        <RestaurantCard
                          key={`open-${r.id}`}
                          r={r}
                          onClick={() => router.push(`/restaurants/${r.id}`)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Grid de Locales Cerrados */}
                  {closedRestaurants.length > 0 && (
                    <div className="pt-10 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-ping" />
                        <h3 className="text-slate-400 text-[10px] font-black tracking-widest uppercase">
                          Fuera de horario
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {closedRestaurants.map((r: Restaurant) => (
                          <div
                            key={`closed-${r.id}`}
                            className="opacity-50 saturate-50 hover:opacity-80 transition-all duration-300 relative"
                          >
                            <div className="absolute top-3 right-3 z-30 bg-slate-900/90 backdrop-blur-md text-white font-black text-[9px] px-2.5 py-1 rounded-lg tracking-widest uppercase">
                              Cerrado
                            </div>
                            <RestaurantCard r={r} onClick={() => router.push(`/restaurants/${r.id}`)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!search && activeCategory === 'all' && <HowItWorksBanner />}
      </div>
    </div>
  );
}