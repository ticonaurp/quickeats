'use client';

interface RestaurantInfoCardProps {
  description: string;
  deliveryFee: number;
}

export default function RestaurantInfoCard({ description, deliveryFee }: RestaurantInfoCardProps) {
  return (
    <div className="relative -mt-8 bg-white rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
      <div className="flex flex-col gap-1.5 max-w-3xl">
        <p className="text-gray-600 text-[0.9rem] font-medium leading-relaxed">
          {description}
        </p>
        <div className="flex items-center gap-2 text-gray-400 text-[0.82rem] mt-0.5">
          <span className="text-[#22C55E] font-bold bg-green-50 px-2 py-0.5 rounded-md">
            S/. {deliveryFee.toFixed(2)} envío
          </span>
        </div>
      </div>
      
      <div className="shrink-0 flex items-center">
        <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full font-bold text-[0.8rem] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
          Abierto
        </span>
      </div>
    </div>
  );
}