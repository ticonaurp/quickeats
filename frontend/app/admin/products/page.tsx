'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Package } from 'lucide-react';
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

  // 🔍 Carga sincronizada desde el Gateway
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [productsRes, restaurantsRes] = await Promise.all([
          fetch('http://localhost:4000/products'),
          fetch('http://localhost:4000/restaurants')
        ]);

        if (!productsRes.ok) throw new Error(`Productos falló: ${productsRes.status}`);
        if (!restaurantsRes.ok) throw new Error(`Restaurantes falló: ${restaurantsRes.status}`);

        const productsData = await productsRes.json();
        const restaurantsData = await restaurantsRes.json();

        setProducts(productsData);
        setRestaurants(restaurantsData);
      } catch (error) {
        console.error('Fallo en sincronización:', error);
        toast.error('No se pudieron sincronizar los datos con el servidor');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 📊 Filtrado dinámico en memoria
  const filtered = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesRest = activeRestaurant === 'all' || p.restaurantId === activeRestaurant;
    return matchesSearch && matchesRest;
  });

  // ❌ Eliminación física en PostgreSQL
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`http://localhost:4000/products/${deleteId}`, {
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
      const response = await fetch(`http://localhost:4000/products/${id}`, {
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
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <Sidebar />

      <div className="flex-1 p-6 sm:p-8">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-950 tracking-tight">Productos</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              {loading ? 'Cargando menú...' : `${products.length} productos en ${restaurants.length} restaurantes`}
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/products/new')}
            className="flex items-center gap-2 bg-[#22C55E] hover:opacity-90 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Plus size={16} /> Agregar Producto
          </button>
        </div>

        {/* Filtros */}
        <ProductFilter
          search={search}
          setSearch={setSearch}
          activeRestaurant={activeRestaurant}
          setActiveRestaurant={setActiveRestaurant}
          restaurants={restaurants}
        />

        {/* Estado de Carga / Render de Tarjetas */}
        {loading ? (
          <div className="text-center py-24 text-sm font-medium text-gray-400">
            Conectando con el Gateway de QuickEats...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
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

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-6">
                <Package size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-medium">No se encontraron productos en la base de datos</p>
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