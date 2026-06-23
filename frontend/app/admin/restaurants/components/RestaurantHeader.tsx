"use client";

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface RestaurantHeaderProps {
  total: number;
}

export function RestaurantHeader({ total }: RestaurantHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
      <div>
        <h1 className="font-black text-3xl text-slate-900 tracking-tight font-poppins">
          Restaurantes
        </h1>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          {total} establecimientos registrados · <span className="text-amber-500 font-mono text-xs font-bold">Monitoreo en tiempo real</span>
        </p>
      </div>
      
      {/*  Botón Restilizado al Gradiente Oficial Mango de QuickEats */}
      <button
        onClick={() => router.push('/admin/restaurants/new')}
        className="flex items-center justify-center gap-2 bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white text-sm font-black px-5 py-3 rounded-xl shadow-md shadow-orange-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus size={16} strokeWidth={2.5} /> Agregar Restaurante
      </button>
    </div>
  );
}