'use client';

import { Flame, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem } from '../page';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: string;
  image: string;
  isPopular: boolean;
}

interface MenuSectionProps {
  items: MenuItem[];
  cart: CartItem[];
  onUpdateQuantity: (id: string, name: string, price: number, action: 'increase' | 'decrease') => void;
}

export default function MenuSection({ items, cart, onUpdateQuantity }: MenuSectionProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;

        return (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex justify-between gap-4 hover:shadow-md transition-shadow"
          >
            {/* Detalles (Izquierda) */}
            <div className="flex flex-col flex-1">
              {item.isPopular && (
                <div className="flex items-center gap-1 bg-white border border-gray-100 w-fit px-2.5 py-0.5 rounded-lg shadow-sm mb-2">
                  <Flame size={12} className="text-[#F97316] fill-[#F97316]" />
                  <span className="text-[#0F172A] font-extrabold text-[0.72rem] tracking-tight">Popular</span>
                </div>
              )}
              
              <h3 className="font-bold text-[#0F172A] text-[1.05rem] tracking-tight">{item.name}</h3>
              <p className="text-gray-400 text-[0.82rem] mt-1 leading-relaxed max-w-xl">{item.description}</p>
              
              <div className="flex items-center gap-3 mt-auto pt-4">
                <span className="font-black text-[#0F172A] text-[1.1rem]">S/. {item.price.toFixed(2)}</span>
                <span className="text-gray-300 text-[0.8rem] font-medium">{item.calories}</span>
              </div>
            </div>

            {/* Multimedia e Interacción Inteligente (Derecha) */}
            <div className="flex flex-col items-center justify-between shrink-0 gap-3">
              <div className="w-[110px] h-[90px] rounded-xl overflow-hidden bg-gray-50">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              {quantity > 0 ? (
                /* 🟢 Módulo de Control de Cantidad Activo (Estilo Figma) */
                <div className="flex items-center justify-between w-full bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.name, item.price, 'decrease')}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-200/60 hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    <Minus size={12} className="stroke-[2.5]" />
                  </button>
                  <span className="text-[#0F172A] font-bold text-[0.88rem]">{quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.name, item.price, 'increase')}
                    className="w-7 h-7 bg-[#22C55E] text-white rounded-lg flex items-center justify-center hover:bg-[#16A34A] transition-colors"
                  >
                    <Plus size={12} className="stroke-[2.5]" />
                  </button>
                </div>
              ) : (
                /* Botón Inicial de Agregar */
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpdateQuantity(item.id, item.name, item.price, 'increase')}
                  className="w-full bg-[#22C55E] text-white font-bold text-[0.82rem] py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 hover:bg-[#16A34A] transition-colors shadow-sm shadow-green-100"
                >
                  <Plus size={14} className="stroke-[2.5]" />
                  Agregar
                </motion.button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}