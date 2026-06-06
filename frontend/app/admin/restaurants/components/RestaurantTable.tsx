"use client";

import { useRouter } from 'next/navigation';
import { Clock, Bike, ToggleLeft, ToggleRight, Edit2 } from 'lucide-react'; // 💡 Quitamos 'Star' ya que no se usa

interface Restaurant {
  id: string;
  name: string;
  address: string;
  category: string;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  image: string;
}

interface RestaurantTableProps {
  data: Restaurant[];
  onToggleOpen: (id: string) => void;
}

export function RestaurantTable({ data, onToggleOpen }: RestaurantTableProps) {
  const router = useRouter();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Restaurante</th>
            <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Categoría</th>
            <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Entrega</th>
            <th className="text-left px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map(r => (
            <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
              
              {/* 1. RESTAURANTE */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={r.image} alt={r.name} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100" />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{r.address}</p>
                  </div>
                </div>
              </td>
              
              {/* 2. CATEGORÍA */}
              <td className="px-4 py-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-500 border border-gray-100">
                  {r.category}
                </span>
              </td>
              
              {/* ❌ AQUÍ ESTABA EL TD DEL RATING QUE HABÍA QUE BORRAR */}

              {/* 3. ENTREGA */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    {r.deliveryTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bike size={13} className="text-gray-400" />
                    {r.deliveryFee === 0 ? 'Gratis' : `S/ ${r.deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              </td>
              
              {/* 4. ESTADO */}
              <td className="px-4 py-4">
                <button onClick={() => onToggleOpen(r.id)} className="flex items-center gap-2 focus:outline-none group">
                  {r.isOpen ? (
                    <>
                      <ToggleRight size={22} className="text-green-500 transition-transform group-hover:scale-105" />
                      <span className="text-xs font-bold text-green-600">Abierto</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={22} className="text-gray-300 transition-transform group-hover:scale-105" />
                      <span className="text-xs font-bold text-gray-400">Cerrado</span>
                    </>
                  )}
                </button>
              </td>
              
              {/* 5. ACCIONES */}
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => router.push(`/admin/restaurants/${r.id}/edit`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 bg-white hover:border-green-300 hover:text-green-600 hover:bg-green-50/20 transition-all shadow-sm"
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}