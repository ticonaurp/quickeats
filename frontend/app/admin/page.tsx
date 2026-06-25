"use client";

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Utensils, Package } from 'lucide-react';

// 🔄 Importaciones absolutas alineadas a la estructura del proyecto
import { Sidebar } from '@/app/admin/components/Sidebar';
import { StatCard } from '@/app/admin/components/StatCard';
import { RevenueChart } from '@/app/admin/components/RevenueChart';
import { CategoryChart } from '@/app/admin/components/CategoryChart';
import { RecentOrders } from '@/app/admin/components/RecentOrders';
import { TopRestaurants } from '@/app/admin/components/TopRestaurants';
import { fetchFromGateway } from '@/app/services/api';

// Paleta para el gráfico de categorías (arranca en mango para alinear con la marca)
const CATEGORY_PALETTE = ['#f59e0b', '#3b82f6', '#22C55E', '#8b5cf6', '#ef4444', '#14b8a6', '#ec4899'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, restaurants: 0, products: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topRestaurants, setTopRestaurants] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        // 🚀 Una sola tanda de peticiones en paralelo (eficiente). Si una falla, no tumba el resto.
        const [restaurants, products, orders] = await Promise.all([
          fetchFromGateway('/restaurants').catch(() => []),
          fetchFromGateway('/products').catch(() => []),
          fetchFromGateway('/orders').catch(() => []),
        ]);
        if (!active) return;

        const restList = Array.isArray(restaurants) ? restaurants : [];
        const prodList = Array.isArray(products) ? products : [];
        const ordList = Array.isArray(orders) ? orders : [];

        const restById = new Map<string, any>(restList.map((r: any) => [r.id, r]));

        // --- Métricas principales (todas reales) ---
        // Ingresos = solo pedidos NO cancelados (un pedido cancelado no genera ingreso real).
        const revenue = ordList
          .filter((o: any) => o.status !== 'CANCELLED')
          .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
        setStats({
          revenue,
          orders: ordList.length,
          restaurants: restList.length,
          products: prodList.length,
        });

        // --- Pedidos recientes (reales, ordenados por fecha) ---
        const recent = [...ordList]
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((o: any) => ({
            id: o.id,
            name: o.restaurantName || restById.get(o.restaurantId)?.name || 'Restaurante',
            total: Number(o.total) || 0,
            status: String(o.status || 'PENDING').toUpperCase(),
            image: restById.get(o.restaurantId)?.image || null,
          }));
        setRecentOrders(recent);

        // --- Restaurantes con más pedidos (real: cuenta de órdenes por restaurante) ---
        const countByRest = new Map<string, number>();
        ordList.forEach((o: any) => {
          countByRest.set(o.restaurantId, (countByRest.get(o.restaurantId) || 0) + 1);
        });
        const top = restList
          .map((r: any) => ({
            id: r.id,
            name: r.name,
            category: r.category,
            image: r.image,
            count: countByRest.get(r.id) || 0,
          }))
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 5);
        setTopRestaurants(top);

        // --- Pedidos por categoría (real: categoría del restaurante de cada orden) ---
        const catCount = new Map<string, number>();
        ordList.forEach((o: any) => {
          const cat = restById.get(o.restaurantId)?.category || 'Otros';
          catCount.set(cat, (catCount.get(cat) || 0) + 1);
        });
        const catData = [...catCount.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([name, value], i) => ({ name, value, color: CATEGORY_PALETTE[i % CATEGORY_PALETTE.length] }));
        setCategoryData(catData);

        // --- Ingresos por mes (últimos 6 meses, reales a partir de createdAt + total) ---
        const now = new Date();
        const months: { key: string; month: string; revenue: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            month: d.toLocaleDateString('es-PE', { month: 'short' }),
            revenue: 0,
          });
        }
        const monthIdx = new Map(months.map((m) => [m.key, m]));
        ordList.forEach((o: any) => {
          const d = new Date(o.createdAt);
          const m = monthIdx.get(`${d.getFullYear()}-${d.getMonth()}`);
          if (m) m.revenue += Number(o.total) || 0;
        });
        setRevenueData(months.map((m) => ({ month: m.month, revenue: m.revenue })));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen w-full font-sans antialiased text-slate-900">
      {/* Menú de navegación lateral fijo con la identidad Mango */}
      <Sidebar />

      {/* Área central del Dashboard */}
      <main className="flex-1 p-8 max-w-350 mx-auto w-full space-y-6">
        {/* Cabecera del Panel */}
        <div className="pb-2 border-b border-slate-100">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-poppins">Panel de Control</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Resumen operativo de <span className="text-amber-500 font-bold">QuickEats</span>
          </p>
        </div>

        {/* 📊 Métricas reales del sistema */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Ingresos Totales"
            value={loading ? '—' : `S/ ${stats.revenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={DollarSign}
            bgColor="bg-amber-50/70"
            iconColor="text-amber-600"
          />
          <StatCard
            label="Pedidos"
            value={loading ? '—' : String(stats.orders)}
            icon={ShoppingBag}
            bgColor="bg-orange-50/70"
            iconColor="text-orange-600"
          />
          <StatCard
            label="Restaurantes"
            value={loading ? '—' : String(stats.restaurants)}
            icon={Utensils}
            bgColor="bg-slate-50"
            iconColor="text-slate-600"
          />
          <StatCard
            label="Productos"
            value={loading ? '—' : String(stats.products)}
            icon={Package}
            bgColor="bg-slate-100/50"
            iconColor="text-slate-700"
          />
        </div>

        {/* 📈 Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueData} loading={loading} />
          </div>
          <div>
            <CategoryChart data={categoryData} loading={loading} />
          </div>
        </div>

        {/* 📋 Pedidos recientes y top de restaurantes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders orders={recentOrders} loading={loading} />
          <TopRestaurants restaurants={topRestaurants} loading={loading} />
        </div>
      </main>
    </div>
  );
}
