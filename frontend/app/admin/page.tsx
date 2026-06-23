"use client";

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Utensils, Package, Sparkles } from 'lucide-react';

// 🔄 Importaciones absolutas alineadas a la estructura de tu proyecto
import { Sidebar } from '@/app/admin/components/Sidebar';
import { StatCard } from '@/app/admin/components/StatCard';
import { RevenueChart } from '@/app/admin/components/RevenueChart';
import { CategoryChart } from '@/app/admin/components/CategoryChart';
import { RecentOrders } from '@/app/admin/components/RecentOrders';
import { TopRestaurants } from '@/app/admin/components/TopRestaurants';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  // Evita errores de hidratación (Hydration Mismatch) en Next.js SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen w-full font-sans antialiased text-slate-900">
      
      {/* Menú de navegación lateral fijo con la identidad Mango */}
      <Sidebar />

      {/* Área central del Dashboard */}
      <main className="flex-1 p-8 max-w-350 mx-auto w-full space-y-6">
        
        {/* Cabecera del Panel Estilizada */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-poppins">
              Panel de Control
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Bienvenido al resumen operativo en tiempo real de <span className="text-amber-500 font-bold">QuickEats</span>
            </p>
          </div>
          
          {/* Badge estético de estado del laboratorio/servidor */}
          <div className="self-start sm:self-auto inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100/60 rounded-xl px-3 py-1.5 text-amber-700 text-xs font-bold shadow-xs">
            <Sparkles size={12} className="text-amber-500 animate-pulse" />
            <span>Sistemas Sincronizados</span>
          </div>
        </div>

        {/* 📊 Bloque de Métricas Renovado bajo el esquema de color QuickEats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            label="Ingresos Totales" 
            value="S/ 4,850.00" 
            icon={DollarSign} 
            bgColor="bg-amber-50/70" 
            iconColor="text-amber-600" 
          />
          <StatCard 
            label="Pedidos Activos" 
            value="12" 
            icon={ShoppingBag} 
            bgColor="bg-orange-50/70" 
            iconColor="text-orange-600" 
          />
          <StatCard 
            label="Restaurantes" 
            value="3" 
            icon={Utensils} 
            bgColor="bg-slate-50" 
            iconColor="text-slate-600" 
          />
          <StatCard 
            label="Productos" 
            value="31" 
            icon={Package} 
            bgColor="bg-slate-100/50" 
            iconColor="text-slate-700" 
          />
        </div>

        {/* 📈 Sección de Gráficos Estadísticos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <CategoryChart />
          </div>
        </div>

        {/* 📋 Secciones Inferiores: Órdenes Recientes y Top Locales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders />
          <TopRestaurants />
        </div>

      </main>
    </div>
  );
}