'use client';

import { ShoppingCart } from 'lucide-react';

export default function TopNavbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 font-sans antialiased">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* 🟢 LOGO IZQUIERDO FIEL A FIGMA (image_a629e4.png) */}
        <div className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="w-9 h-9 bg-[#22C55E] rounded-full flex items-center justify-center">
            <span className="text-white font-black text-[1.15rem] leading-none select-none">
              Q
            </span>
          </div>
          <span className="font-extrabold text-xl text-[#0F172A] tracking-tight">
            Quick<span className="text-[#22C55E]">Eats</span>
          </span>
        </div>

        {/* Centro: Navegación */}
        <div className="flex items-center gap-8">
          <button className="text-[#0F172A] font-semibold text-[0.92rem] hover:text-[#22C55E] transition-colors">
            Restaurantes
          </button>
          <button className="text-gray-500 font-medium text-[0.92rem] hover:text-[#22C55E] transition-colors">
            Ordenes
          </button>
        </div>

        {/* Derecha: Carrito y Perfil */}
        <div className="flex items-center gap-5">
          <button className="relative p-2 text-gray-600 hover:text-[#0F172A] transition-colors">
            <ShoppingCart size={20} className="stroke-[2.2]" />
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer border border-gray-100 rounded-full py-1 pl-1 pr-3 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-[#22C55E] text-white rounded-full flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-[#0F172A] font-semibold text-[0.88rem] tracking-tight">Alex</span>
          </div>
        </div>

      </div>
    </nav>
  );
}