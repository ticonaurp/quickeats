'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Package, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

// Sub-componentes locales de productos
import { ProductFilter } from './components/ProductFilter';
import { ProductCardAdmin } from './components/ProductCardAdmin';
import { DeleteModal } from './components/DeleteModal';

// Tu Sidebar nativo
import { Sidebar } from '../components/Sidebar';

interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  calories?: number;
  price: number;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  restaurantId: string;
}

interface Restaurant {
  id: string;
  name: string;
}

export default function ProductManagementPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeRestaurant, setActiveRestaurant] = useState('all');
  
  // Lógica de estados reales conectados a la DB
  const [products, setProducts] = useState<Product[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 🌐 Base URL dinámica para todo el componente
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // 🔍 Carga sincronizada desde el Gateway sin caché de Next.js
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [productsRes, restaurantsRes] = await Promise.all([
          fetch(`${baseUrl}/products?_t=${Date.now()}`, { cache: 'no-store' }),
          fetch(`${baseUrl}/restaurants?_t=${Date.now()}`, { cache: 'no-store' })
        ]);

        if (!productsRes.ok) throw new Error(`Productos falló: ${productsRes.status}`);
        if (!restaurantsRes.ok) throw new Error(`Restaurantes falló: ${restaurantsRes.status}`);

        const productsData = await productsRes.json();
        const restaurantsData = await restaurantsRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
      } catch (error) {
        console.error('Fallo en de sincronización:', error);
        toast.error('No se pudieron sincronizar los datos con el servidor');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [baseUrl]);

  // 📊 Filtrado dinámico optimizado con useMemo
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
      const matchesRest = activeRestaurant === 'all' || p.restaurantId === activeRestaurant;
      return matchesSearch && matchesRest;
    });
  }, [products, search, activeRestaurant]);

  // ❌ Eliminación física en PostgreSQL
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`${baseUrl}/products/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteId));
        toast.success('Producto eliminado con éxito');
      } else {
        toast.error('No se pudo eliminar el producto del servidor');
      }
    } catch (error) {
      toast.error('Error de red al intentar eliminar');
    } finally {
      setDeleteId(null);
    }
  };

  // 🔄 Modificar disponibilidad con persistencia PUT
  const toggleAvailability = async (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    if (!targetProduct) return;

    const updatedAvailable = !targetProduct.isAvailable;

    try {
      const response = await fetch(`${baseUrl}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...targetProduct,
          isAvailable: updatedAvailable,
        }),
      });

      if (response.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isAvailable: updatedAvailable } : p))
        );
        toast.success(updatedAvailable ? 'Producto marcado como Disponible' : 'Producto marcado como Agotado');
      } else {
        toast.error('Error al actualizar estado en el servidor');
      }
    } catch (error) {
      toast.error('Error de red al cambiar disponibilidad');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <Sidebar />

      <div className="flex-1 p-6 sm:p-8 max-w-350 mx-auto w-full space-y-6">
        
        {/* Cabecera Estilo Mango Premium */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-poppins">Productos</h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              {loading ? (
                <span className="animate-pulse">Conectando con el Gateway de QuickEats...</span>
              ) : (
                <>
                  {products.length} productos registrados · <span className="text-amber-500 font-mono text-xs font-bold">{restaurants.length} restaurantes activos</span>
                </>
              )}
            </p>
          </div>
          
          {/* 🥭 Botón Unificado con la Identidad Mango Corporativo */}
          <button
            onClick={() => router.push('/admin/products/new')}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white text-sm font-black px-5 py-3 rounded-xl shadow-md shadow-orange-500/10 transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={16} strokeWidth={3} /> Agregar Producto
          </button>
        </div>

        {/* Barra de Filtros y Búsqueda Estilizada */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <ProductFilter
            search={search}
            setSearch={setSearch}
            activeRestaurant={activeRestaurant}
            setActiveRestaurant={setActiveRestaurant}
            restaurants={restaurants}
          />
        </div>

        {/* Contenedor Principal de Resultados */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-20 text-center text-slate-400 shadow-xs">
            <p className="text-sm font-semibold animate-pulse">Sincronizando el flujo de inventario...</p>
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-xs max-w-md mx-auto p-8 space-y-3">
                <Package size={36} className="mx-auto text-slate-300" />
                <h3 className="text-slate-800 font-bold text-base font-poppins">Sin coincidencias</h3>
                <p className="text-slate-400 text-xs font-medium">No se encontraron productos en la base de datos bajo este filtro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => {
                  const restaurant = restaurants.find((r) => r.id === product.restaurantId);
                  return (
                    <ProductCardAdmin
                      key={product.id}
                      product={product}
                      restaurantName={restaurant?.name || 'Desconocido'}
                      onEdit={() => router.push(`/admin/products/${product.id}/edit`)}
                      onToggleVisibility={() => toggleAvailability(product.id)}
                      onDeleteTrigger={() => setDeleteId(product.id)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        <DeleteModal
          isOpen={Boolean(deleteId)}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
} 