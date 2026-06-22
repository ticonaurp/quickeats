'use client';

import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, ChevronDown, ClipboardList, AlertCircle, Store, User, Bike, CheckCircle, XCircle, ShoppingBag, ArrowRight, Calendar, UtensilsCrossed, MapPin, ReceiptText, ChefHat, Check } from 'lucide-react';
import Link from 'next/link';
// 🎯 Alias nativos @ para resolver dependencias limpiamente
import { fetchFromGateway } from '@/app/services/api';
import { getUserId } from '@/app/services/auth';

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

// 🎯 Consistencia de Estados: Diccionario de metadatos idéntico al del Admin
const STATUS_META: Record<string, { label: string; color: string; bg: string; stepIndex: number; icon: React.ReactNode }> = {
  PENDING: { 
    label: 'Recibido', 
    color: '#4b5563', 
    bg: '#f3f4f6', 
    stepIndex: 1, 
    icon: <ReceiptText size={14} /> 
  }, 
  PREPARING: { 
    label: 'Cocina', 
    color: '#b45309', 
    bg: '#fef3c7', 
    stepIndex: 2, 
    icon: <ChefHat size={14} className="animate-pulse" /> 
  }, 
  DELIVERING: { 
    label: 'En Camino', 
    color: '#c2410c', 
    bg: '#ffedd5', 
    stepIndex: 3, 
    icon: <Bike size={14} className="animate-bounce" /> 
  }, 
  DELIVERED: { 
    label: 'Entregado', 
    color: '#15803d', 
    bg: '#dcfce7', 
    stepIndex: 4, 
    icon: <CheckCircle size={14} /> 
  }, 
  CANCELLED: { 
    label: 'Cancelado', 
    color: '#dc2626', 
    bg: '#fee2e2', 
    stepIndex: 0, 
    icon: <XCircle size={14} /> 
  }, 
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

export default function OrdersHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setError('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    // 🔄 Polling Dinámico e Inmediato sin Caché Intermedia de Next.js
    const loadData = async () => {
      try {
        // 💡 Inyectamos un query param dinámico (_t) y configuramos el bypass de caché
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders/user/${userId}?_t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store' // ⚡ CLAVE: Evita que Next.js recuerde la consulta anterior
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        console.error("Error recargando el historial de órdenes:", err);
      } finally {
        setLoading(false);
      }
    };

    // Consulta inicial reactiva
    loadData();

    // 🕒 Consulta limpia al microservicio cada 10 segundos exactos
    const interval = setInterval(() => {
      loadData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    if (!term) return matchesStatus;

    return (
      o.id.toLowerCase().includes(term) || 
      o.restaurantName.toLowerCase().includes(term) ||
      o.items?.some(item => item.name.toLowerCase().includes(term))
    ) && matchesStatus;
  });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 bg-slate-200 rounded-xl w-48 animate-pulse mb-4" />
        {[1, 2].map((n) => (
          <div key={n} className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4 animate-pulse">
            <div className="flex justify-between">
              <div className="h-5 bg-slate-200 rounded-md w-40" />
              <div className="h-6 bg-slate-200 rounded-full w-24" />
            </div>
            <div className="h-20 bg-slate-100 rounded-xl w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-4xl border border-slate-100 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h3 className="font-black text-xl text-slate-900 font-poppins">Error de Carga</h3>
        <p className="text-slate-400 text-sm font-medium">{error}</p>
        <Link href="/login" className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-all">
          Reingresar a mi cuenta
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full py-12 font-sans antialiased text-gray-900">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-poppins">Mis Pedidos</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Historial completo y monitoreo en tiempo real de tus órdenes en QuickEats.
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por ID, restaurante o plato..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Chips de filtro */}
        {orders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
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
              const meta = STATUS_META[value] || STATUS_META.PENDING;
              return (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
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
        )}

        {/* Lista de Pedidos */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-4xl border border-slate-100 p-12 text-center max-w-sm mx-auto shadow-xs space-y-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 font-poppins">¿Qué vas a comer hoy?</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Aún no registras ninguna compra en el sistema.</p>
            </div>
            <Link
              href="/user"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-600 transition-all shadow-md shadow-green-500/10"
            >
              Ver Restaurantes <ArrowRight size={14} />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-xs max-w-md mx-auto p-8">
            <ClipboardList size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-gray-400">No se encontraron pedidos con el criterio buscado.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.PENDING;
              
              const getBarColor = () => {
                if (meta.stepIndex === 4) return 'bg-green-600';
                if (meta.stepIndex === 3) return 'bg-blue-500';
                if (meta.stepIndex === 2) return 'bg-amber-500';
                return 'bg-slate-400';
              };

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-100/80 p-6 sm:p-7 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-black text-slate-900 font-poppins text-xl group-hover:text-amber-500 transition-colors tracking-tight">
                          {order.restaurantName}
                        </h3>
                        <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-1 rounded-md font-mono font-bold tracking-wider">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-slate-500">
                          <Calendar size={13} />
                          {formatDate(order.createdAt)}
                        </span>
                        <span>•</span>
                        <span>{order.paymentMethod === 'CARD' ? '💳 Tarjeta' : '💵 Efectivo'}</span>
                      </div>
                    </div>

                    <div className="shrink-0 self-start sm:self-auto">
                      <div 
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase shadow-xs border border-transparent"
                        style={{ color: meta.color, background: meta.bg }}
                      >
                        {meta.icon}
                        <span>{meta.label}</span>
                      </div>
                    </div>
                  </div>

                  {meta.stepIndex > 0 && (
                    <div className="pt-4 pb-2 border-t border-b border-slate-50/80 my-1 bg-slate-50/30 rounded-2xl px-2">
                      <div className="flex items-center justify-between relative w-full px-4 sm:px-8">
                        <div className="absolute top-4 left-8 right-8 h-1 bg-slate-200/70 -z-10 rounded-full" />
                        <div 
                          className={`absolute top-4 left-8 h-1 ${getBarColor()} -z-10 rounded-full transition-all duration-500`}
                          style={{ width: `${((meta.stepIndex - 1) / 3) * 100}%` }}
                        />

                        {[
                          { label: 'Recibido', icon: <ReceiptText size={15} />, index: 1 },
                          { label: 'Cocina', icon: <ChefHat size={15} />, index: 2 },
                          { label: 'En Camino', icon: <Bike size={15} />, index: 3 },
                          { label: 'Entregado', icon: <CheckCircle size={15} />, index: 4 }
                        ].map((step) => {
                          const isCurrent = meta.stepIndex === step.index;
                          const isPassed = meta.stepIndex > step.index;

                          let finalStyle = 'bg-white text-slate-300 border-slate-200';
                          if (isCurrent) {
                            if (step.index === 1) finalStyle = 'bg-slate-700 text-white border-slate-700 shadow-md scale-110 font-bold';
                            if (step.index === 2) finalStyle = 'bg-amber-500 text-white border-amber-500 shadow-md scale-110 font-bold';
                            if (step.index === 3) finalStyle = 'bg-blue-500 text-white border-blue-500 shadow-md scale-110 font-bold';
                            if (step.index === 4) finalStyle = 'bg-green-600 text-white border-green-600 shadow-md scale-110 font-bold';
                          } else if (isPassed) {
                            if (step.index === 1) finalStyle = 'bg-slate-600 text-white border-slate-600';
                            if (step.index === 2) finalStyle = 'bg-amber-500 text-white border-amber-500';
                            if (step.index === 3) finalStyle = 'bg-blue-500 text-white border-blue-500';
                          }

                          return (
                            <div key={step.index} className="flex flex-col items-center gap-2 text-center">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${finalStyle}`}>
                                {isPassed ? <Check size={15} strokeWidth={3} /> : step.icon}
                              </div>
                              <span className={`text-[11px] tracking-tight font-extrabold transition-colors hidden sm:block ${
                                isCurrent ? 'text-slate-800 font-black' : isPassed ? 'text-slate-500' : 'text-slate-300'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-black mb-1">
                      <ReceiptText size={12} />
                      <span>Resumen de platillos</span>
                    </div>
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-slate-200/70 text-slate-600 font-extrabold px-2 py-0.5 rounded-lg shrink-0">
                            {item.quantity}x
                          </span>
                          <span className="text-slate-800 font-bold tracking-tight">{item.name}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-xs">S/. {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-2 gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-400 font-medium truncate max-w-sm">
                      <MapPin size={14} className="text-slate-300 shrink-0" />
                      <p className="truncate">
                        <span className="text-slate-500 font-bold">Entregar en:</span> {order.address}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 bg-slate-50/50 border border-slate-100 sm:border-0 sm:bg-transparent px-4 py-3 sm:p-0 rounded-xl shrink-0">
                      <div className="text-slate-400 text-right font-semibold hidden sm:block">
                        <p>Subtotal: S/. {order.subtotal.toFixed(2)}</p>
                        <p className="text-[10px] font-medium text-slate-400">Envío: S/. {order.deliveryFee.toFixed(2)}</p>
                      </div>
                      <div className="text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                        <span className="text-slate-400 font-bold sm:hidden">Total Pagado:</span>
                        <span className="text-green-600 font-black text-xl font-poppins tracking-tight">
                          S/. {order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}