'use client';

import { Zap } from 'lucide-react';

interface DeliveryEstimationProps {
  restaurantName: string;
}

export default function DeliveryEstimation({ restaurantName }: DeliveryEstimationProps) {
  return (
    <div className="bg-green-50/70 border border-[#22C55E]/10 rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#22C55E]/5">
        <Zap size={16} className="text-[#22C55E] fill-[#22C55E]" />
      </div>
      <div className="flex flex-col">
        <p className="text-[#0F172A] font-bold text-[0.9rem] -mb-0.5">Entrega estimada</p>
        <p className="text-gray-600 text-[0.82rem] font-medium leading-tight">
          20 min <span className="text-gray-400 font-normal">de {restaurantName}</span>
        </p>
      </div>
    </div>
  );
}