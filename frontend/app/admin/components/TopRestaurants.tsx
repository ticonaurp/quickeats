import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface TopRestaurant {
  id: string;
  name: string;
  category: string;
  image: string;
  count: number;
}

export function TopRestaurants({ restaurants, loading }: { restaurants: TopRestaurant[]; loading?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 tracking-tight">Restaurantes con más pedidos</h2>
        <Link href="/admin/restaurants" className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:underline">
          Gestionar <ArrowUpRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No hay restaurantes registrados.</p>
      ) : (
        <div className="space-y-3">
          {restaurants.map((r, index) => (
            <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
              <span className="text-sm font-black text-gray-300 w-4 text-center">{index + 1}</span>
              <img src={r.image} alt={r.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{r.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{r.category}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-sm font-bold text-gray-900">
                  <ShoppingBag size={13} className="text-amber-500" />
                  {r.count}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{r.count === 1 ? 'pedido' : 'pedidos'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
