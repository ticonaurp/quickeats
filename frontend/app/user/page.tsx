'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 🟢 1. Importar el enrutador nativo
import { LOCAL_CATEGORIES, RESTAURANTS_MOCK } from '../data/mockData';
import TopNavbar from '../components/TopNavbar';
import RestaurantCard from '../components/shared/RestaurantCard';
import ExpressDeliveryCarousel from '../components/home/ExpressDeliveryCarousel';
import HowItWorksBanner from '../components/home/HowItWorksBanner';

export default function UserPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const router = useRouter(); // 🟢 2. Inicializar el enrutador

  const filtered = RESTAURANTS_MOCK.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q);
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  const openRestaurants = filtered.filter(r => r.isOpen);
  const closedRestaurants = filtered.filter(r => !r.isOpen);
  const expressRestaurants = openRestaurants.filter(r => parseInt(r.deliveryTime) <= 25);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <TopNavbar />

      {/* Header Hero */}
      <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] px-6 pt-12 pb-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-6">
            <p className="text-green-50/90 text-[0.875rem]">Hola, <span className="text-white font-bold">Alex</span> 👋</p>
            <h1 className="text-white mt-1 font-extrabold text-[1.75rem] sm:text-[2.3rem] tracking-tight leading-none">¿Qué vas a pedir hoy?</h1>
          </div>
          <div className="w-full max-w-2xl flex items-center gap-3 bg-white/20 border border-white/20 backdrop-blur-sm rounded-2xl px-4 py-3.5 focus-within:bg-white/25 focus-within:border-white transition-all">
            <Search size={18} className="text-white/80 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar restaurantes o comidas..." className="flex-1 bg-transparent outline-none text-white placeholder-white/70 text-[0.92rem]" />
            {search && <button onClick={() => setSearch('')} className="text-white/80 hover:text-white text-xl">×</button>}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 -mt-7">
        {/* Categorías */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {LOCAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all shrink-0 border ${
                  activeCategory === cat.id ? 'bg-[#22C55E] text-white border-[#22C55E]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#22C55E]/40'
                }`}
                style={{ fontWeight: 600, fontSize: '0.85rem' }}
              >
                <span className="text-[1.1rem]">{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🟢 3. Redirección instalada en el Carrusel */}
        {!search && activeCategory === 'all' && expressRestaurants.length > 0 && (
          <ExpressDeliveryCarousel 
            restaurants={expressRestaurants} 
            onSelect={(id) => router.push(`/restaurants/${id}`)} 
          />
        )}

        {/* Catálogo de Restaurantes */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0F172A] text-[1.1rem] tracking-tight">{search ? `Resultados para "${search}"` : 'Todos los restaurantes'}</h2>
            <span className="text-gray-400 text-[0.8rem] font-medium">{openRestaurants.length} disponibles</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <span className="text-3xl block mb-2">🍽️</span>
              <p className="text-gray-700 font-bold">No encontramos resultados</p>
            </div>
          ) : (
            <div className="space-y-9">
              {/* 🟢 4. Redirección instalada en las Cards disponibles */}
              {openRestaurants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {openRestaurants.map(r => (
                    <RestaurantCard 
                      key={r.id} 
                      r={r} 
                      onClick={() => router.push(`/restaurants/${r.id}`)} 
                    />
                  ))}
                </div>
              )}
              
              {/* Cerrados (sin redirección por estar deshabilitados o hacia flujo controlado) */}
              {closedRestaurants.length > 0 && (
                <div className="pt-4">
                  <p className="text-gray-400 text-[0.75rem] font-bold tracking-wider uppercase mb-4">Cerrados ahora</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {closedRestaurants.map(r => (
                      <RestaurantCard key={r.id} r={r} onClick={() => {}} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!search && activeCategory === 'all' && <HowItWorksBanner />}
      </div>
    </div>
  );
}