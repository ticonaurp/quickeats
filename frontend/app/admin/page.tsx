"use client";

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Utensils, Package } from 'lucide-react';

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
    <div className="flex bg-[#f8fafc] min-h-screen w-full font-sans antialiased text-gray-900">
      
      {/* Menú de navegación lateral fijo */}
      <Sidebar />

      {/* Área central del Dashboard */}
      <main className="flex-1 p-8 max-w-[1400px] mx-auto w-full space-y-6">
        
        {/* Cabecera del Panel */}
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Bienvenido al resumen general de QuickEats
          </p>
        </div>

        {/* 📊 Bloque de Métricas (Simplificado sin los porcentajes de 'change') */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            label="Ingresos Totales" 
            value="S/ 4,850.00" 
            icon={DollarSign} 
            bgColor="bg-green-50" 
            iconColor="text-green-500" 
          />
          <StatCard 
            label="Pedidos Activos" 
            value="12" 
            icon={ShoppingBag} 
            bgColor="bg-blue-50" 
            iconColor="text-blue-500" 
          />
          <StatCard 
            label="Restaurantes" 
            value="3" 
            icon={Utensils} 
            bgColor="bg-amber-50" 
            iconColor="text-amber-500" 
          />
          <StatCard 
            label="Productos" 
            value="31" 
            icon={Package} 
            bgColor="bg-purple-50" 
            iconColor="text-purple-500" 
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