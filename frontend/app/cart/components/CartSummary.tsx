'use client';

import { Utensils, ArrowRight } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  onClearCart: () => void;
  onProceed: () => void; // 🟢 Recibimos la nueva función de validación
}

export default function CartSummary({ subtotal, deliveryFee, total, onClearCart, onProceed }: CartSummaryProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm min-h-[200px] flex flex-col font-sans antialiased pb-6">
      
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
        <Utensils size={16} className="text-[#F97316]" />
        <h2 className="font-bold text-[#0F172A] text-[0.98rem]">Resumen del pedido</h2>
      </div>

      {subtotal === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center px-4 py-6">
          <p className="text-gray-400 text-[0.8rem] font-medium max-w-[160px]">
            Agrega productos para calcular el total
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-3 pt-1">
            <div className="flex justify-between text-gray-400 text-[0.88rem]">
              <span>Subtotal</span>
              <span className="font-medium text-gray-700">S/. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-[0.88rem]">
              <span>Costo de Envío</span>
              <span className="font-medium text-gray-700">S/. {deliveryFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-6 space-y-2.5">
            <div className="flex justify-between font-bold text-[#0F172A] text-[0.98rem] pt-1">
              <span>Total</span>
              <span className="text-2xl text-[#0F172A] font-black tracking-tight">S/. {total.toFixed(2)}</span>
            </div>

            {/* 🟢 Cambiado: Ahora ejecuta onProceed que valida el token con redirect inteligente */}
            <button 
              onClick={onProceed}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-[1rem] py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 mt-5 transition-colors shadow-md shadow-orange-100 tracking-tight"
            >
              Proceder al Pago
              <ArrowRight size={17} className="stroke-[2.5]" />
            </button>
            
            <button 
              onClick={onClearCart}
              className="w-full text-center text-red-500 hover:text-red-600 font-bold text-[0.82rem] mt-4 transition-colors block"
            >
              Limpiar carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}