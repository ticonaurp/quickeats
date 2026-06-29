'use client';

import { Zap } from 'lucide-react';

interface DeliveryEstimationProps {
  restaurantName: string;
  deliveryTime: number | string; // 🟢 AGREGADO: Nueva prop para el tiempo de entrega dinámico
}

export default function DeliveryEstimation({ restaurantName, deliveryTime }: DeliveryEstimationProps) {
  return (
    <div className="bg-orange-50/70 border border-[#F97316]/10 rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#F97316]/5">
        <Zap size={16} className="text-[#F97316] fill-[#F97316]" />
      </div>
      <div className="flex flex-col">
        <p className="text-[#0F172A] font-bold text-[0.9rem] -mb-0.5">Entrega estimada</p>
        <p className="text-gray-600 text-[0.82rem] font-medium leading-tight">
          {deliveryTime} min <span className="text-gray-400 font-normal">de {restaurantName}</span>
        </p>
      </div>
    </div>
  );
}