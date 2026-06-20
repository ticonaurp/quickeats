"use client";

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ClipboardList, AlertCircle, Store, User } from 'lucide-react';
import { toast } from 'sonner';
import { Sidebar } from '../components/Sidebar';
import { getOrders, updateOrderStatus } from '@/app/services/order.service';

interface OrderItem {
  id: string;
  productId: string;
  name: string;     
  price: number;    
  quantity: number; 
}

interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  address: string;
  deliveryNotes?: string | null;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[]; 
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente', color: '#4b5563', bg: '#f3f4f6' }, 
  PREPARING: { label: 'En preparación', color: '#b45309', bg: '#fef3c7' }, 
  DELIVERING: { label: 'En camino', color: '#c2410c', bg: '#ffedd5' }, 
  DELIVERED: { label: 'Entregado', color: '#15803d', bg: '#dcfce7' }, 
  CANCELLED: { label: 'Cancelado', color: '#dc2626', bg: '#fee2e2' }, 
};

const STATUS_LIST = ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // frontend/app/admin/orders/page.tsx

useEffect(() => {
  setMounted(true);

  // 🔄 Función aislada para poder llamarla repetidamente
  const loadData = async () => {
    try {
      setError(null);
      const ordersData = await getOrders();
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err: any) {
      console.error("Error cargando órdenes en el admin:", err);
      // No seteamos el error global en las re-peticiones para no interrumpir la UX del admin
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial inmediata
  loadData();

  // 🕒 Polling activo: Consulta nuevas órdenes automáticamente cada 10 segundos
  const interval = setInterval(() => {
    loadData();
  }, 10000); 

  return () => {
    setMounted(false);
    clearInterval(interval); // Limpiamos el timer al desmontar la página
  };
}, []);

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    if (!term) return matchesStatus;

    const matchesMetadata = 
      o.id.toLowerCase().includes(term) || 
      o.userId.toLowerCase().includes(term) ||
      o.restaurantName.toLowerCase().includes(term);

    const matchesProducts = o.items?.some(item => 
      item.name.toLowerCase().includes(term)
    );

    return (matchesMetadata || matchesProducts) && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success(`Estado actualizado a "${STATUS_META[status]?.label ?? status}"`);
    } catch (err: any) {
      toast.error(err.message || 'No se pudo actualizar el estado del pedido.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
      <Sidebar />

      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-6">
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Pedidos</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total · <span className="text-amber-600 font-mono text-xs">Mango Engine v2.1</span>
            </p>
          </div>

          {/* Buscador Integrado arriba a la derecha */}
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por ID, restaurante o plato..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Chips de filtro por estado */}
        <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              statusFilter === 'all' 
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/10' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
            }`}
          >
            Todos
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {orders.length}
            </span>
          </button>
          {STATUS_LIST.map((value) => {
            const count = orders.filter((o) => o.status === value).length;
            const meta = STATUS_META[value];
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  statusFilter === value ? 'border-transparent shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                }`}
                style={statusFilter === value ? { background: meta.bg, color: meta.color } : {}}
              >
                {meta.label}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/5">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Contenedor de la Tabla */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm font-medium animate-pulse">Cargando el flujo de órdenes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4 bg-red-50/50 text-red-600">
              <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
              <p className="text-sm font-semibold mb-1">Error de integración en el Backend</p>
              <p className="text-xs text-red-500 max-w-md mx-auto font-mono bg-white p-3 rounded-lg border border-red-100 mt-2">
                {error}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ClipboardList size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium">No se encontraron pedidos con los criterios ingresados.</p>
            </div>
          ) : (
            <>
              {/* Tabla (Escritorio) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      {['ID Pedido', 'Restaurante', 'Productos Solicitados', 'Total', 'Fecha', 'Estado', 'Acción'].map((h) => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((order) => {
                      const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
                      const isFinal = order.status === 'DELIVERED' || order.status === 'CANCELLED';
                      
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                          {/* ID Pedido */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </span>
                          </td>

                          {/* Restaurante */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-black text-slate-900 capitalize tracking-tight flex items-center gap-1.5">
                                <Store size={14} className="text-slate-400 shrink-0" />
                                {order.restaurantName}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <User size={11} className="shrink-0" />
                                {order.userId.substring(0, 7)}
                              </span>
                            </div>
                          </td>
                          
                          {/* Productos Solicitados */}
                          <td className="px-6 py-4 max-w-xs">
                            <div className="space-y-1.5">
                              {order.items?.map((item) => (
                                <div key={item.id} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                  <span className="truncate max-w-[180px]">{item.name}</span>
                                  <span className="text-amber-600 font-extrabold text-[11px] bg-amber-50 px-1.5 py-0.2 rounded-sm shrink-0">
                                    x{item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          
                          {/* Total */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-extrabold text-slate-900">S/ {order.total.toFixed(2)}</span>
                              <span className="text-[10px] text-slate-400 font-medium">Envío: S/ {order.deliveryFee.toFixed(2)}</span>
                            </div>
                          </td>

                          {/* Fecha */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs text-slate-500 font-medium">{formatDate(order.createdAt)}</span>
                          </td>

                          {/* Estado Actual */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide uppercase" style={{ color: meta.color, background: meta.bg }}>
                              {meta.label}
                            </span>
                          </td>

                          {/* Acción Desplegable */}
                          <td className="px-6 py-4 指定-width-select whitespace-nowrap">
                            <div className="relative inline-block text-left">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={isFinal || updatingId === order.id}
                                className="pl-3 pr-8 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 cursor-pointer appearance-none disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-slate-50"
                              >
                                {STATUS_LIST.map((s) => (
                                  <option key={s} value={s}>
                                    {STATUS_META[s].label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover:text-slate-600" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista Móvil */}
              <div className="lg:hidden divide-y divide-slate-100">
                {filtered.map((order) => {
                  const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
                  const isFinal = order.status === 'DELIVERED' || order.status === 'CANCELLED';
                  
                  return (
                    <div key={order.id} className="p-5 space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">{formatDate(order.createdAt)}</span>
                          </div>
                          
                          <p className="font-black text-slate-900 text-sm capitalize flex items-center gap-1.5">
                            <Store size={14} className="text-slate-400" />
                            {order.restaurantName}
                          </p>
                          
                          <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
                            {order.items?.map((item) => (
                              <p key={item.id} className="text-xs text-slate-600 font-medium truncate">
                                • {item.name} <span className="text-amber-600 font-extrabold">(x{item.quantity})</span>
                              </p>
                            ))}
                          </div>
                          
                          <p className="text-xs font-black text-slate-900 pt-1">
                            Total: S/ {order.total.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">(Envío S/ {order.deliveryFee.toFixed(2)})</span>
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0" style={{ color: meta.color, background: meta.bg }}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="relative w-full">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={isFinal || updatingId === order.id}
                          className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500 cursor-pointer appearance-none disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          {STATUS_LIST.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}