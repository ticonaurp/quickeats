import { ArrowUpRight } from 'lucide-react';

const orders = [
  { id: 'ord-001', name: 'The Burger Lab', price: 43.46, status: 'delivered', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&q=80' },
  { id: 'ord-002', name: 'Sakura Ramen House', price: 42.96, status: 'preparing', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&q=80' },
  { id: 'ord-003', name: 'Pizzeria Da Luigi', price: 56.00, status: 'delivering', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&q=80' },
];

export function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 tracking-tight">Pedidos Recientes</h2>
        <button className="flex items-center gap-1 text-xs font-bold text-green-500 hover:underline">
          Ver todos <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
            <img src={order.img} alt={order.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{order.name}</p>
              <p className="text-xs font-mono text-gray-400 mt-0.5">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-gray-900">${order.price.toFixed(2)}</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                order.status === 'delivered' ? 'text-green-700 bg-green-50' :
                order.status === 'preparing' ? 'text-amber-700 bg-amber-50' : 'text-blue-700 bg-blue-50'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}