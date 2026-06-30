'use client';

import { ShoppingCart, Plus, Minus, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartItem } from '../page';

interface CartSidebarProps {
  cart: CartItem[];
  deliveryFee: number;
  onUpdateQuantity: (id: string, name: string, price: number, action: 'increase' | 'decrease') => void;
}

export default function CartSidebar({ cart, deliveryFee, onUpdateQuantity }: CartSidebarProps) {
  const router = useRouter();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-6 shadow-sm min-h-[280px] flex flex-col font-sans antialiased">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-[#F97316]" />
          <h2 className="font-bold text-[#0F172A] text-[1rem]">Tu pedido</h2>
        </div>
        {totalItems > 0 && (
          <span className="w-5 h-5 bg-[#F97316] text-white font-bold text-[0.72rem] rounded-full flex items-center justify-center shadow-sm">
            {totalItems}
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
          <div className="w-12 h-12 border border-dashed border-gray-200 rounded-full flex items-center justify-center mb-3">
            <ShoppingCart size={20} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-[0.82rem] font-medium max-w-[160px]">Agrega platos para comenzar</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1 scrollbar-hide">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2 text-[0.88rem]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                    <button onClick={() => onUpdateQuantity(item.id, item.name, item.price, 'decrease')} className="w-5 h-5 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100"><Minus size={10} /></button>
                    <span className="font-bold text-[#0F172A] text-[0.82rem] px-0.5">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.name, item.price, 'increase')} className="w-5 h-5 bg-[#F97316] text-white rounded flex items-center justify-center hover:bg-[#EA580C]"><Plus size={10} /></button>
                  </div>
                  <span className="text-[#0F172A] font-medium truncate max-w-[120px] sm:max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-bold text-[#0F172A] shrink-0">S/. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 mt-6 space-y-2.5">
            <div className="flex justify-between text-gray-400 text-[0.85rem]"><span>Subtotal</span><span className="font-medium text-gray-700">S/. {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-400 text-[0.85rem]"><span>Envío</span><span className="font-medium text-gray-700">S/. {deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-[#0F172A] text-[0.98rem] pt-1"><span>Total</span><span className="text-xl text-[#0F172A] font-black">S/. {total.toFixed(2)}</span></div>

            {/* 🟢 Redirección corregida a /cart */}
            <button 
              onClick={() => router.push('/cart')} 
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[0.9rem] py-3 px-4 rounded-xl flex items-center justify-center gap-1 mt-4 transition-colors shadow-md shadow-orange-100"
            >
              Ver carrito
              <ChevronRight size={16} className="mt-0.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}