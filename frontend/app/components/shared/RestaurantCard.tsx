"use client";

import { Clock, Bike, Zap, Star } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  image?: string | null;
  deliveryTime: number;
  deliveryFee: number;
  isFeatured?: boolean;
}

interface RestaurantCardProps {
  r: Restaurant;
  onClick: () => void;
}

export default function RestaurantCard({ r, onClick }: RestaurantCardProps) {
  const isExpress = r.deliveryTime <= 30;
  const validImagePlaceholder = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80';
  const imageSrc = (r.image && r.image.length > 3) ? r.image : validImagePlaceholder;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between group cursor-pointer"
    >
      {/* Contenedor de Imagen */}
      <div className="relative h-40 sm:h-48 w-full bg-slate-100 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={r.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = validImagePlaceholder;
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Badges superiores - Color Mango Integrado 🥭 */}
        {isExpress && (
          <span className="absolute top-3 left-3 bg-linear-to-r from-amber-500 via-orange-500 to-orange-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
            <Zap size={10} className="fill-white" /> Envío Rápido
          </span>
        )}

        {r.isFeatured && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
            <Star size={10} className="fill-white" /> Destacado
          </span>
        )}
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3 mb-1.5">
            {/* 🥭 Hover cambia al color Mango de la marca */}
            <h3 className="font-black text-lg text-slate-900 font-poppins tracking-tight group-hover:text-amber-500 transition-colors truncate">
              {r.name}
            </h3>
            <span className="bg-slate-100 text-slate-600 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-lg shrink-0 tracking-wide border border-slate-200/40">
              {r.category}
            </span>
          </div>
          
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {r.description || 'Sin descripción disponible'}
          </p>
        </div>

        {/* Footer de la tarjeta con tiempos de entrega */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
          <div className="flex items-center gap-1.5 bg-orange-50/60 text-orange-700 px-2.5 py-1.5 rounded-xl border border-orange-100/30">
            <Clock size={13} className="text-amber-500" />
            <span>{r.deliveryTime} min</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-xl shrink-0 border border-emerald-100/50">
            <Bike size={14} className="text-emerald-500" />
            <span>
              {(r.deliveryFee ?? 0) === 0 
                ? 'Envío Gratis' 
                : `S/ ${Number(r.deliveryFee).toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}