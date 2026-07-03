'use client';

interface RestaurantInfoCardProps {
  description: string;
  deliveryFee: number;
  isOpen: boolean;
}

export default function RestaurantInfoCard({ description, deliveryFee, isOpen }: RestaurantInfoCardProps) {
  return (
    <div className="relative -mt-8 bg-white rounded-2xl border border-gray-100 shadow-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
      <div className="flex flex-col gap-1.5 max-w-3xl">
        <p className="text-gray-600 text-[0.9rem] font-medium leading-relaxed">
          {description}
        </p>
        <div className="flex items-center gap-2 text-gray-400 text-[0.82rem] mt-0.5">
          <span className="text-[#F97316] font-bold bg-orange-50 px-2 py-0.5 rounded-md">
            S/. {deliveryFee.toFixed(2)} envío
          </span>
        </div>
      </div>

      <div className="shrink-0 flex items-center">
        {isOpen ? (
          <span className="bg-[#F97316]/10 text-[#F97316] px-3 py-1 rounded-full font-bold text-[0.8rem] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full" />
            Abierto
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold text-[0.8rem] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            Cerrado
          </span>
        )}
      </div>
    </div>
  );
}