"use client";

import { useRouter } from 'next/navigation';
import { Edit2 } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  deliveryFee: number;
  isOpen: boolean;
  image: string;
}

interface RestaurantMobileListProps {
  data: Restaurant[];
  onToggleOpen: (id: string) => void;
}

export function RestaurantMobileList({ data, onToggleOpen }: RestaurantMobileListProps) {
  const router = useRouter();

  return (
    <div className="md:hidden divide-y divide-gray-100">
      {data.map(r => (
        <div key={r.id} className="p-4 flex items-center gap-3 bg-white hover:bg-gray-50/50 transition-colors">
          <img
            src={r.image}
            alt={r.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{r.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-gray-400">{r.category}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <button onClick={() => onToggleOpen(r.id)} className="text-left">
                {r.isOpen
                  ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">● Abierto</span>
                  : <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">● Cerrado</span>
                }
              </button>
              <span className="text-xs font-medium text-gray-400">
                {r.deliveryFee === 0 ? 'Envío gratis' : `Envío: S/ ${r.deliveryFee.toFixed(2)}`}
              </span>
            </div>
          </div>
          <button 
            onClick={() => router.push(`/admin/restaurants/${r.id}/edit`)} 
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50/20 transition-all shadow-sm shrink-0"
          >
            <Edit2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}