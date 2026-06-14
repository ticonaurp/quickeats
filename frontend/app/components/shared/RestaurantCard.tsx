'use client';

import { ChevronRight, Zap, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { Restaurant } from '../../data/mockData';

export default function RestaurantCard({ r, onClick }: { r: Restaurant; onClick: () => void }) {
  const disabled = !r.isOpen;
  
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { y: -4, scale: 1.005 }}
      transition={{ duration: 0.15 }}
      className={`text-left w-full bg-white rounded-3xl overflow-hidden border border-gray-100 group transition-shadow font-sans antialiased ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:border-gray-200/80'
      }`}
    >
      {/* Contenedor de Imagen de Proporción Ancha (Figma Style) */}
      <div className="relative h-[165px] sm:h-[185px] w-full overflow-hidden bg-gray-50">
        <img 
          src={r.image} 
          alt={r.name} 
          className={`w-full h-full object-cover transition-transform duration-500 ${!disabled && 'group-hover:scale-[1.03]'}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

        {/* Esquina Izquierda: Popular (Fondo Blanco, Letra Negra, Icono Fuego) */}
        {r.isPopular && r.isOpen && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-sm border border-black/5">
            <Flame size={13} className="text-[#F97316] fill-[#F97316]" />
            <span className="text-[#0F172A] font-extrabold text-[0.78rem] tracking-tight">
              Popular
            </span>
          </div>
        )}

        {/* Esquina Derecha: Tiempo de Entrega */}
        <div className="absolute top-3 right-3 bg-[#22C55E] flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-sm">
          <Zap size={11} className="text-white fill-white" />
          <span className="text-white font-extrabold text-[0.82rem] tracking-tight">
            {r.deliveryTime} min
          </span>
        </div>

        {/* Cerrado Overlay */}
        {!r.isOpen && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-white/95 text-gray-800 px-4 py-1.5 rounded-full font-bold text-[0.8rem] shadow-sm">
              Cerrado ahora
            </span>
          </div>
        )}
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <h3 className="font-bold text-[#0F172A] text-[1.05rem] tracking-tight truncate">{r.name}</h3>
          {r.isOpen && <span className="flex-shrink-0 w-2 h-2 bg-[#22C55E] rounded-full" />}
        </div>
        
        <p className="text-gray-400 text-[0.82rem] font-medium mb-4">{r.cuisine}</p>
        
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100/70">
          <span className="text-gray-500 text-[0.85rem] font-medium tracking-tight">
            {r.deliveryFee === 0 ? (
              <span className="text-[#22C55E] font-bold">Envío Gratis</span>
            ) : (
              `S/. ${r.deliveryFee.toFixed(2)} envío`
            )}
          </span>
          
          {r.isOpen && (
            <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#22C55E] transition-colors">
              <ChevronRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}