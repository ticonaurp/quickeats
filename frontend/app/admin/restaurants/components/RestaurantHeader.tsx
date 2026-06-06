"use client";

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface RestaurantHeaderProps {
  total: number;
}

export function RestaurantHeader({ total }: RestaurantHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="font-black text-2xl text-gray-900 tracking-tight font-sans">
          Restaurantes
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">{total} restaurantes en total</p>
      </div>
      <button
        onClick={() => router.push('/admin/restaurants/new')}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-95 shadow-sm shadow-green-500/10 bg-[#22C55E]"
      >
        <Plus size={16} /> Agregar Restaurante
      </button>
    </div>
  );
}