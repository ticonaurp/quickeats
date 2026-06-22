'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Bike, CheckCircle, XCircle, ShoppingBag, ArrowRight, Calendar, UtensilsCrossed, MapPin, ReceiptText, ChefHat, Check } from 'lucide-react';
import Link from 'next/link';
import { fetchFromGateway } from '../services/api';
import { getUserId } from '../services/auth';

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
  deliveryNotes?: string;
  paymentMethod: 'CARD' | 'CASH' | string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELLED' | string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          setError('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
          return;
        }

        const data = await fetchFromGateway(`/orders/user/${userId}`);
        if (isMounted) setOrders(data || []);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Error al conectar con el servidor.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return {
          bg: 'bg-green-50 text-green-700 border-green-100',
          icon: <CheckCircle size={14} className="text-green-500" />,
          label: 'Entregado',
          stepIndex: 4,
          colorTheme: 'emerald'
        };
      case 'PREPARING':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-100',
          icon: <Clock size={14} className="text-blue-500 animate-pulse" />,
          label: 'En Cocina',
          stepIndex: 2,
          colorTheme: 'blue'
        };
      case 'PENDING':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-100',
          icon: <Bike size={14} className="text-amber-500 animate-bounce" />,
          label: 'Pendiente',
          stepIndex: 1,
          colorTheme: 'amber'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-red-50 text-red-700 border-red-100',
          icon: <XCircle size={14} className="text-red-500" />,
          label: 'Cancelado',
          stepIndex: 0,
          colorTheme: 'red'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-100',
          icon: <ShoppingBag size={14} />,
          label: status,
          stepIndex: 1,
          colorTheme: 'slate'
        };
    }
  };

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
          <XCircle size={24} />
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
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans antialiased text-slate-900 selection:bg-green-100">
      
      {/* Header Principal */}
      <div className="flex items-center justify-between mb-10 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-3xl font-black font-poppins tracking-tight sm:text-4xl text-slate-900">Mis Pedidos</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Historial completo y monitoreo de tus órdenes en QuickEats.</p>
        </div>
        <div className="bg-white border border-slate-100 text-slate-700 px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs shrink-0">
          <ShoppingBag size={14} className="text-green-500" />
          <span>{orders.length} pedidos</span>
        </div>
      </div>

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
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const config = getStatusConfig(order.status);
            
            // Determina el color de la barra según el estado para darle máxima vida
            const getBarColor = () => {
              if (config.stepIndex === 4) return 'bg-emerald-500';
              if (config.stepIndex === 2) return 'bg-blue-500';
              return 'bg-amber-500';
            };

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-100/80 p-6 sm:p-7 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 group"
              >
                {/* 1. Bloque Superior: Datos e Identificadores */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-black text-slate-900 font-poppins text-xl group-hover:text-green-600 transition-colors tracking-tight">
                        {order.restaurantName}
                      </h3>
                      <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-mono font-bold tracking-wider">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-slate-500">
                        <Calendar size={13} />
                        {new Date(order.createdAt).toLocaleDateString('es-PE', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </span>
                      <span>•</span>
                      <span>{order.paymentMethod === 'CARD' ? '💳 Tarjeta' : '💵 Efectivo'}</span>
                    </div>
                  </div>

                  {/* Badge de estado superior */}
                  <div className="shrink-0 self-start sm:self-auto">
                    <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-black tracking-wide shadow-xs ${config.bg}`}>
                      {config.icon}
                      <span>{config.label}</span>
                    </div>
                  </div>
                </div>

                {/* 2. ✨ Tracker de Línea de Tiempo Full Color Modificado */}
                {config.stepIndex > 0 && (
                  <div className="pt-4 pb-2 border-t border-b border-slate-50/80 my-1 bg-slate-50/30 rounded-2xl px-2">
                    <div className="flex items-center justify-between relative w-full px-4 sm:px-8">
                      {/* Linea gris base */}
                      <div className="absolute top-4 left-8 right-8 h-1 bg-slate-200/70 -z-10 rounded-full" />
                      {/* Linea de progreso con color adaptativo */}
                      <div 
                        className={`absolute top-4 left-8 h-1 ${getBarColor()} -z-10 rounded-full transition-all duration-500`}
                        style={{ width: `${((config.stepIndex - 1) / 3) * 100}%` }}
                      />

                      {[
                        { label: 'Recibido', icon: <ReceiptText size={15} />, colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 active:bg-emerald-500 active:text-white' },
                        { label: 'Cocina', icon: <ChefHat size={15} />, colorClass: 'text-blue-600 bg-blue-50 border-blue-200 active:bg-blue-500 active:text-white' },
                        { label: 'En Camino', icon: <Bike size={15} />, colorClass: 'text-amber-600 bg-amber-50 border-amber-200 active:bg-amber-500 active:text-white' },
                        { label: 'Entregado', icon: <CheckCircle size={15} />, colorClass: 'text-slate-600 bg-slate-50 border-slate-200 active:bg-slate-600 active:text-white' }
                      ].map((step, index) => {
                        const stepNum = index + 1;
                        const isCurrent = config.stepIndex === stepNum;
                        const isPassed = config.stepIndex > stepNum;

                        // Asignación de clases de color dinámicas e intensas para quitar lo simplón
                        let finalStyle = 'bg-white text-slate-300 border-slate-200';
                        if (isCurrent) {
                          if (stepNum === 1) finalStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/30 scale-115 font-bold';
                          if (stepNum === 2) finalStyle = 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/30 scale-115 font-bold';
                          if (stepNum === 3) finalStyle = 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/30 scale-115 font-bold';
                          if (stepNum === 4) finalStyle = 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/30 scale-115 font-bold';
                        } else if (isPassed) {
                          if (stepNum === 1) finalStyle = 'bg-emerald-500 text-white border-emerald-500';
                          if (stepNum === 2) finalStyle = 'bg-blue-500 text-white border-blue-500';
                          if (stepNum === 3) finalStyle = 'bg-amber-500 text-white border-amber-500';
                        }

                        return (
                          <div key={index} className="flex flex-col items-center gap-2 text-center">
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

                {/* 3. Desglose del menú relacional */}
                <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-black mb-1">
                    <ReceiptText size={12} />
                    <span>Resumen de platillos</span>
                  </div>
                  {order.items && order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-200/70 text-slate-600 font-extrabold px-2 py-0.5 rounded-lg shrink-0">
                          {item.quantity}x
                        </span>
                        <span className="text-slate-800 font-bold tracking-tight">{item.name}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-xs">S/. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* 4. Bloque Inferior: Destino y Facturación */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-2 gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2 text-slate-400 font-medium truncate max-w-sm">
                    <MapPin size={14} className="text-slate-300 shrink-0" />
                    <p className="truncate">
                      <span className="text-slate-500 font-bold">Entregar en:</span> {order.address}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 bg-slate-50/50 border border-slate-100 sm:border-0 sm:bg-transparent px-4 py-3 sm:p-0 rounded-xl shrink-0">
                    <div className="text-slate-400 text-right font-semibold hidden sm:block">
                      <p>Subtotal: S/. {(order.subtotal ?? (order.total - order.deliveryFee)).toFixed(2)}</p>
                      <p className="text-[10px] font-medium text-slate-400">Envío: S/. {order.deliveryFee.toFixed(2)}</p>
                    </div>
                    <div className="text-right flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                      <span className="text-slate-400 font-bold sm:hidden">Total Pagado:</span>
                      <span className="text-green-600 font-black text-xl font-poppins tracking-tight">
                        S/. {Number(order.total).toFixed(2)}
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
  );
}