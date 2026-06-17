'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartHeaderProps {
  restaurantId: string;
  restaurantName: string;
}

export default function CartHeader({ restaurantId, restaurantName }: CartHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button 
        // 🟢 CORREGIDO: Si no hay ID, te regresa a la vista principal en '/user'
        onClick={() => {
          if (!restaurantId || restaurantId === '/' || restaurantId === '') {
            router.push('/user'); 
          } else {
            router.push(`/restaurants/${restaurantId}`);
          }
        }}
        className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors group shrink-0"
      >
        <ArrowLeft size={18} className="text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <div className="flex flex-col">
        <h1 className="font-extrabold text-[#0F172A] text-xl sm:text-2xl tracking-tight leading-none">
          Tu Carrito
        </h1>
        <p className="text-gray-400 text-[0.88rem] font-medium mt-0.5">de {restaurantName}</p>
      </div>
    </div>
  );
}