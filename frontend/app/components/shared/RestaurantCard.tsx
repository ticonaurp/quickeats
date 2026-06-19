"use client";

import { Clock, Bike, Zap } from 'lucide-react';
import { Restaurant } from '../../data/mockData';

interface RestaurantCardProps {
  r: Restaurant;
  onClick: () => void;
}

export default function RestaurantCard({ r, onClick }: RestaurantCardProps) {
  // Regla de negocio: si el tiempo es menor o igual a 30 min, es envío rápido
  const isExpress = r.deliveryTime <= 30;

  // 🛡️ Filtro seguro integrado: si viene nulo, vacío, o strings de prueba corruptos ('d', 'dw'), usa el fallback
  const validImagePlaceholder = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80';
  const imageSrc = (r.image && r.image.length > 3) ? r.image : validImagePlaceholder;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group cursor-pointer"
    >
      {/* Contenedor de Imagen */}
      {/* ✨ Corregido: Clases h-[165px] y sm:h-[185px] optimizadas a h-41.25 y sm:h-46.25 */}
      <div className="relative h-41.25 sm:h-46.25 w-full bg-gray-100 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={r.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // 🔄 Salvaguarda extra por si el enlace original parecía válido pero está roto en internet
            (e.target as HTMLImageElement).src = validImagePlaceholder;
          }}
        />
        
        {/* ✨ Corregido: bg-linear-to-t cambiado por bg-linear-to-t */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Badges superiores sobre la imagen */}
        {isExpress && (
          <span className="absolute top-3 left-3 bg-linear-to-r from-amber-500 to-orange-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 animate-pulse">
            <Zap size={10} className="fill-white" /> Fast Delivery
          </span>
        )}

        {/* Muestra "Destacado ⭐" si isFeatured es true en la BD */}
        {r.isFeatured && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
            ⭐ Destacado
          </span>
        )}
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-extrabold text-lg text-gray-900 font-poppins tracking-tight group-hover:text-green-600 transition-colors truncate">
              {r.name}
            </h3>
            <span className="bg-gray-100 text-gray-500 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shrink-0">
              {r.category}
            </span>
          </div>
          
          {/* ✨ Corregido: Se cambió r.cuisine por r.description (Sincronizado con Prisma) */}
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">
            {r.description || 'Sin descripción disponible'}
          </p>
        </div>

        {/* Footer de la tarjeta con tiempos de entrega */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2.5 py-1.5 rounded-lg">
            <Clock size={13} className="text-orange-500" />
            <span>{r.deliveryTime} min</span>
          </div>
          
          {/* ✨ Corregido: flex-shrink-0 optimizado a shrink-0 y sincronizado con deliveryFee */}
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1.5 rounded-lg shrink-0">
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