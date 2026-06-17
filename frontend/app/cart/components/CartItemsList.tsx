'use client';

import { Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { CheckoutCartItem } from '../page';

interface CartItemsListProps {
  cart: CheckoutCartItem[];
  restaurantId: string;
  onUpdateQuantity: (id: string, action: 'increase' | 'decrease') => void;
  onRemoveFromCart: (id: string) => void;
}

export default function CartItemsList({ cart, restaurantId, onUpdateQuantity, onRemoveFromCart }: CartItemsListProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center"
          >
            <span className="text-3xl block mb-2">🍽️</span>
            <p className="text-gray-700 font-bold text-[0.95rem]">Tu carrito está vacío</p>
            <p className="text-gray-400 text-sm mt-0.5">Explora el menú y agrega tus platos favoritos.</p>
          </motion.div>
        ) : (
          cart.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-[80px] h-[70px] shrink-0 rounded-xl overflow-hidden bg-gray-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-[#0F172A] text-[1rem] tracking-tight truncate max-w-[200px]">{item.name}</h3>
                  <p className="text-gray-300 text-[0.78rem] font-medium -mt-0.5">{item.calories} c/u</p>
                  
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg p-0.5 w-fit mt-2">
                    <button onClick={() => onUpdateQuantity(item.id, 'decrease')} className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100"><Minus size={10} /></button>
                    <span className="font-bold text-[#0F172A] text-[0.82rem] px-0.5">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 'increase')} className="w-5 h-5 bg-[#22C55E] text-white rounded flex items-center justify-center hover:bg-[#16A34A]"><Plus size={10} /></button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <span className="font-black text-[#0F172A] text-[1.1rem] tracking-tight">S/. {(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => onRemoveFromCart(item.id)}
                  className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-colors"
                >
                  <Trash2 size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>

      <button 
        // 🟢 CORREGIDO: El botón de añadir más productos ahora también redirige de forma segura a '/user'
        onClick={() => {
          if (!restaurantId || restaurantId === '/' || restaurantId === '') {
            router.push('/user');
          } else {
            router.push(`/restaurants/${restaurantId}`);
          }
        }}
        className="w-full bg-white text-[#22C55E] font-bold text-[0.85rem] py-3 rounded-2xl flex items-center justify-center gap-1.5 border border-dashed border-gray-200 hover:border-[#22C55E]/40 hover:bg-green-50/40 transition-colors"
      >
        <Plus size={15} className="stroke-[2.5]" />
        Añadir más productos
      </button>
    </div>
  );
}