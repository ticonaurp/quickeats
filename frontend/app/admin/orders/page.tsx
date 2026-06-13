"use client";

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ClipboardList, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Sidebar } from '../components/Sidebar';
import { getOrders, updateOrderStatus } from '@/app/services/order.service';

// 🧾 Estructura real de una orden tal como la devuelve el order-service
interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: string;
  createdAt: string;
}

// 🛒 Solo necesitamos estos campos del producto para enriquecer la tabla
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string | null;
}

// 🎨 Los 5 estados que acepta el backend (en mayúscula) con su etiqueta y color
const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pendiente', color: '#6b7280', bg: '#f3f4f6' },
  PREPARING: { label: 'En preparación', color: '#d97706', bg: '#fef3c7' },
  DELIVERING: { label: 'En camino', color: '#22C55E', bg: '#dcfce7' },
  DELIVERED: { label: 'Entregado', color: '#15803d', bg: '#dcfce7' },
  CANCELLED: { label: 'Cancelado', color: '#dc2626', bg: '#fee2e2' },
};

const STATUS_LIST = ['PENDING', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'];

// 🌐 Base URL dinámica: en Render usa NEXT_PUBLIC_API_URL, en local cae al gateway local
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const loadData = async () => {
      try {
        setError(null);

        // 🔄 Pedimos las órdenes y el catálogo de productos en paralelo
        const [ordersData, productsRes] = await Promise.all([
          getOrders(),
          fetch(`${API_URL}/products`).then((r) => r.json()),
        ]);

        // Construimos un diccionario productId -> producto para buscar nombre y precio
        const map: Record<string, Product> = {};
        if (Array.isArray(productsRes)) {
          for (const p of productsRes) {
            map[p.id] = { id: p.id, name: p.name, price: p.price, image: p.image };
          }
        }

        setProductMap(map);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err: any) {
        setError(err.message || 'No se pudo conectar con el servidor backend.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🔍 Filtrado por búsqueda (id de orden o de usuario) y por estado
  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      o.id.toLowerCase().includes(term) ||
      o.userId.toLowerCase().includes(term) ||
      (productMap[o.productId]?.name ?? '').toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      // Actualizamos el estado localmente para reflejar el cambio sin recargar
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

      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-5">
        {/* Cabecera */}
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">Gestión de Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
          </p>
        </div>

        {/* Buscador */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID de pedido, usuario o producto..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 transition-colors"
          />
        </div>

        {/* Chips de filtro por estado con contadores */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('all')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 border transition-all ${
              statusFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            Todos
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-black/10">{orders.length}</span>
          </button>
          {STATUS_LIST.map((value) => {
            const count = orders.filter((o) => o.status === value).length;
            const meta = STATUS_META[value];
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 border transition-all ${
                  statusFilter === value ? 'border-transparent' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                style={statusFilter === value ? { background: meta.bg, color: meta.color } : {}}
              >
                {meta.label}
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-black/5">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm font-medium animate-pulse">Conectando con el Gateway y cargando pedidos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 px-4 bg-red-50/50 text-red-600">
              <AlertCircle size={40} className="mx-auto mb-3 text-red-400 stroke-[1.5]" />
              <p className="text-sm font-semibold mb-1">Error de integración en el Backend</p>
              <p className="text-xs text-red-500 max-w-md mx-auto font-mono bg-white p-3 rounded-lg border border-red-100 mt-2">
                {error}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ClipboardList size={40} className="mx-auto mb-3 text-gray-300 stroke-[1.5]" />
              <p className="text-sm font-medium">No se encontraron pedidos.</p>
            </div>
          ) : (
            <>
              {/* Tabla (escritorio) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['ID Pedido', 'Usuario', 'Producto', 'Cantidad', 'Total', 'Fecha', 'Estado', 'Acción'].map((h) => (
                        <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((order) => {
                      const product = productMap[order.productId];
                      const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
                      const total = product ? product.price * order.quantity : null;
                      const isFinal = order.status === 'DELIVERED' || order.status === 'CANCELLED';
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs font-medium text-gray-700">{order.id.substring(0, 8)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs text-gray-500">{order.userId.substring(0, 8)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-gray-900">
                              {product?.name ?? <span className="text-gray-400 italic">Producto no disponible</span>}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-600">{order.quantity}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-gray-900">
                              {total !== null ? `S/ ${total.toFixed(2)}` : '—'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: meta.color, background: meta.bg }}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="relative">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={isFinal || updatingId === order.id}
                                className="pl-3 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-green-400 cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {STATUS_LIST.map((s) => (
                                  <option key={s} value={s}>
                                    {STATUS_META[s].label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Lista (móvil) */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filtered.map((order) => {
                  const product = productMap[order.productId];
                  const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
                  const total = product ? product.price * order.quantity : null;
                  const isFinal = order.status === 'DELIVERED' || order.status === 'CANCELLED';
                  return (
                    <div key={order.id} className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {product?.name ?? 'Producto no disponible'}
                          </p>
                          <p className="text-xs font-mono text-gray-400">#{order.id.substring(0, 8)}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Cant: {order.quantity} · {total !== null ? `S/ ${total.toFixed(2)}` : '—'} · {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0" style={{ color: meta.color, background: meta.bg }}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="relative max-w-xs">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={isFinal || updatingId === order.id}
                          className="w-full pl-3 pr-7 py-2 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-green-400 cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {STATUS_LIST.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {!loading && !error && (
          <p className="text-sm text-gray-400">
            {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} mostrado{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  );
}
