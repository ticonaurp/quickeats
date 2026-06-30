'use client';

import { Zap } from 'lucide-react';
import { Restaurant } from '../../data/mockData';
import RestaurantCard from '../shared/RestaurantCard';

interface ExpressCarouselProps {
  restaurants: Restaurant[];
  onSelect: (id: string) => void;
}

export default function ExpressDeliveryCarousel({ restaurants, onSelect }: ExpressCarouselProps) {
  return (
    <div className="mb-9 font-sans antialiased">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#F97316] rounded-xl flex items-center justify-center">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <h2 className="font-bold text-[#0F172A] text-[1.1rem] tracking-tight">Entrega rápida</h2>
          <span className="bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full text-[0.72rem] font-bold">≤ 25 min</span>
        </div>
      </div>

      {/* 🟢 Contenedor responsivo: En desktop se acopla a las 3 columnas sin cortes */}
      <div 
        className="flex gap-6 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory scrollbar-hide" 
        style={{ scrollbarWidth: 'none' }}
      >
        {restaurants.map(r => (
          <div 
            key={r.id} 
            className="w-[290px] sm:w-[380px] lg:w-[calc(33.333%-16px)] shrink-0 snap-start"
          >
            <RestaurantCard r={r} onClick={() => onSelect(r.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}