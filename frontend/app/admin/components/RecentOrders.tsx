import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface RecentOrder {
  id: string;
  name: string;
  total: number;
  status: string;
  image: string | null;
}

// Mapeo de estados reales del order-service a etiqueta + estilo
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Pendiente', cls: 'text-amber-700 bg-amber-50' },
  PREPARING: { label: 'Preparando', cls: 'text-amber-700 bg-amber-50' },
  DELIVERING: { label: 'En camino', cls: 'text-blue-700 bg-blue-50' },
  DELIVERED: { label: 'Entregado', cls: 'text-green-700 bg-green-50' },
  CANCELLED: { label: 'Cancelado', cls: 'text-red-700 bg-red-50' },
};

export function RecentOrders({ orders, loading }: { orders: RecentOrder[]; loading?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 tracking-tight">Pedidos Recientes</h2>
        <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:underline">
          Ver todos <ArrowUpRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-14 rounded-xl bg-gray-50 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">Aún no hay pedidos registrados.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const st = STATUS_MAP[order.status] || { label: order.status, cls: 'text-gray-600 bg-gray-100' };
            return (
              <div key={order.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
                {order.image ? (
                  <img src={order.image} alt={order.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black shrink-0">
                    {order.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{order.name}</p>
                  <p className="text-xs font-mono text-gray-400 mt-0.5 truncate">#{order.id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">S/ {order.total.toFixed(2)}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${st.cls}`}>
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
