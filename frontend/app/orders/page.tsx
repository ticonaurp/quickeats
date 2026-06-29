'use client';

import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, ChevronDown, ChevronUp, ClipboardList, AlertCircle, Bike, CheckCircle, XCircle, ArrowRight, Calendar, UtensilsCrossed, MapPin, ReceiptText, ChefHat, Check } from 'lucide-react';
import Link from 'next/link';
import { getUserId } from '@/app/services/auth';
import TopNavbar from '../components/TopNavbar';

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

const STATUS_META: Record<string, { label: string; color: string; bg: string; stepIndex: number; icon: React.ReactNode }> = {
  PENDING: { label: 'Recibido', color: '#4b5563', bg: '#f3f4f6', stepIndex: 1, icon: <ReceiptText size={14} /> }, 
  PREPARING: { label: 'Cocina', color: '#b45309', bg: '#fef3c7', stepIndex: 2, icon: <ChefHat size={14} className="animate-pulse" /> }, 
  DELIVERING: { label: 'En Camino', color: '#c2410c', bg: '#ffedd5', stepIndex: 3, icon: <Bike size={14} className="animate-bounce" /> }, 
  DELIVERED: { label: 'Entregado', color: '#15803d', bg: '#dcfce7', stepIndex: 4, icon: <CheckCircle size={14} /> }, 
  CANCELLED: { label: 'Cancelado', color: '#dc2626', bg: '#fee2e2', stepIndex: 0, icon: <XCircle size={14} /> }, 
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

// 📦 COMPONENTE AUXILIAR OPTIMIZADO CON ACORDEÓN COMPACTO
function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const meta = STATUS_META[order.status] || STATUS_META.PENDING;

  const getBarColor = () => {
    if (meta.stepIndex === 4) return 'bg-green-600';
    if (meta.stepIndex === 3) return 'bg-blue-500';
    if (meta.stepIndex === 2) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs transition-all duration-200 hover:shadow-md">
      {/* 💳 CABECERA COMPACTA (Siempre visible - Activador del clic) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-amber-50 shrink-0">
            <ReceiptText size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 tracking-tight text-base truncate max-w-[180px] sm:max-w-xs">
                {order.restaurantName}
              </h3>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md font-mono font-bold">
                #{order.id.substring(0, 8).toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {formatDate(order.createdAt)} • {order.items?.reduce((acc, i) => acc + i.quantity, 0)} items
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div 
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wide"
            style={{ color: meta.color, background: meta.bg }}
          >
            {meta.icon}
            <span className="hidden sm:inline">{meta.label}</span>
          </div>
          <span className="text-amber-600 font-black text-base font-mono">
            S/. {order.total.toFixed(2)}
          </span>
          {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </div>
      </div>

      {/* 🔍 DESPLEGABLE DETALLADO (Renderizado condicional con animaciones) */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-50/80 space-y-5 bg-slate-50/10 rounded-b-2xl">
          
          {/* 1. Stepper de Seguimiento Realtime */}
          {meta.stepIndex > 0 && (
            <div className="py-4 border border-slate-100/60 bg-white rounded-xl px-2 shadow-xs">
              <div className="flex items-center justify-between relative w-full px-4 sm:px-8">
                <div className="absolute top-4 left-8 right-8 h-1 bg-slate-100 -z-10 rounded-full" />
                <div 
                  className={`absolute top-4 left-8 h-1 ${getBarColor()} -z-10 rounded-full transition-all duration-500`}
                  style={{ width: `${((meta.stepIndex - 1) / 3) * 100}%` }}
                />

                {[
                  { label: 'Recibido', icon: <ReceiptText size={14} />, index: 1 },
                  { label: 'Cocina', icon: <ChefHat size={14} />, index: 2 },
                  { label: 'En Camino', icon: <Bike size={14} />, index: 3 },
                  { label: 'Entregado', icon: <CheckCircle size={14} />, index: 4 }
                ].map((step) => {
                  const isCurrent = meta.stepIndex === step.index;
                  const isPassed = meta.stepIndex > step.index;

                  let finalStyle = 'bg-white text-slate-300 border-slate-200';
                  if (isCurrent) {
                    if (step.index === 1) finalStyle = 'bg-slate-700 text-white border-slate-700 shadow-md scale-105';
                    if (step.index === 2) finalStyle = 'bg-amber-500 text-white border-amber-500 shadow-md scale-105';
                    if (step.index === 3) finalStyle = 'bg-blue-500 text-white border-blue-500 shadow-md scale-105';
                    if (step.index === 4) finalStyle = 'bg-green-600 text-white border-green-600 shadow-md scale-105';
                  } else if (isPassed) {
                    if (step.index === 1) finalStyle = 'bg-slate-600 text-white border-slate-600';
                    if (step.index === 2) finalStyle = 'bg-amber-500 text-white border-amber-500';
                    if (step.index === 3) finalStyle = 'bg-blue-500 text-white border-blue-500';
                  }

                  return (
                    <div key={step.index} className="flex flex-col items-center gap-1.5 text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 text-xs ${finalStyle}`}>
                        {isPassed ? <Check size={14} strokeWidth={3} /> : step.icon}
                      </div>
                      <span className={`text-[10px] tracking-tight font-bold hidden sm:block ${
                        isCurrent ? 'text-slate-800 font-extrabold' : isPassed ? 'text-slate-500' : 'text-slate-300'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Desglose de Platillos */}
          <div className="bg-slate-50 border border-slate-100/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-black mb-1">
              <ReceiptText size={12} />
              <span>Resumen de platillos</span>
            </div>
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-white border border-slate-200 text-slate-600 font-extrabold px-1.5 py-0.5 rounded-md">
                    {item.quantity}x
                  </span>
                  <span className="text-slate-800 font-medium tracking-tight">{item.name}</span>
                </div>
                <span className="text-slate-500 font-mono text-xs">S/. {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* 3. Datos de Despacho Financiero */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 text-xs font-bold border-t border-slate-100/60">
            <div className="flex items-center gap-2 text-slate-400 font-medium truncate max-w-sm">
              <MapPin size={14} className="text-slate-300 shrink-0" />
              <p className="truncate text-slate-500">
                <span className="font-bold text-slate-700">Entregar en:</span> {order.address}
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-between sm:justify-end gap-4 text-right text-slate-400 font-semibold">
              <p>Subtotal: S/. {order.subtotal.toFixed(2)}</p>
              <p>Envío: S/. {order.deliveryFee.toFixed(2)}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// 🏛️ SCREEN PRINCIPAL REFACTORIZADA
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

    const loadData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders/user/${userId}?_t=${Date.now()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
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

    loadData();
    const interval = setInterval(loadData, 10000);
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
      <div className="bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
        <TopNavbar />
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
          <div className="h-8 bg-slate-200 rounded-xl w-48 animate-pulse mb-4" />
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-16 border border-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
        <TopNavbar />
        <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-4xl border border-slate-100 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h3 className="font-black text-xl text-slate-900">Error de Carga</h3>
          <p className="text-slate-400 text-sm font-medium">{error}</p>
          <Link href="/login" className="inline-block px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition-all">
            Reingresar a mi cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
      <TopNavbar />
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mis Pedidos</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Historial completo y monitoreo en tiempo real de tus órdenes.
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
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
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
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">¿Qué vas a comer hoy?</h3>
              <p className="text-slate-400 text-sm font-medium mt-1">Aún no registras ninguna compra.</p>
            </div>
            <Link
              href="/user"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-600 transition-all"
            >
              Ver Restaurantes <ArrowRight size={14} />
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-xs max-w-md mx-auto p-8">
            <ClipboardList size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium text-gray-400">No se encontraron pedidos.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* 🟢 Renderizamos el componente dinámico expansible */}
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}