"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Info, DollarSign, Image as ImageIcon, Package, Tag, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Importación de tus componentes modulares nativos
import { Sidebar } from '../../components/Sidebar';
import { FormCard } from './components/FormCard';
import { ToggleSwitch } from './components/ToggleSwitch';

interface Restaurant {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Estados del formulario mapeados al modelo relacional de la DB
  const [restaurantId, setRestaurantId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isPopular, setIsPopular] = useState(false);

  // Sincronización de restaurantes desde el Gateway
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch('http://localhost:3001/restaurants');
        if (res.ok) {
          const data = await res.json();
          setRestaurants(data);
        }
      } catch (error) {
        console.error('Fallo al sincronizar restaurantes:', error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category || !imageUrl || !restaurantId) {
      toast.error('Por favor, completa todos los campos obligatorios (*)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          name,
          description: description || null,
          category,
          calories: calories ? parseInt(calories, 10) : null,
          price: parseFloat(price),
          image: imageUrl,
          isAvailable,
          isPopular,
        }),
      });

      if (response.ok) {
        toast.success('¡Producto creado con éxito!');
        router.push('/admin/products');
      } else {
        const err = await response.json();
        toast.error(err.message || 'Error al crear el producto');
      }
    } catch (error) {
      toast.error('Error de red al conectar con el Gateway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-gray-900 w-full">
      {/* 📊 BARRA LATERAL FIJA DE QUICKEATS */}
      <Sidebar />

      {/* 🏢 ÁREA CENTRAL DE TRABAJO */}
      <main className="flex-1 p-6 sm:p-8 max-w-5xl space-y-6 overflow-y-auto">
        
        {/* Link superior de retorno */}
        <Link 
          href="/admin/products" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={14} /> Volver a Productos
        </Link>

        {/* Bloque del Título con Icono Circular Verde */}
        <div className="flex items-center gap-4 pt-1">
          <div className="p-3 bg-[#22C55E] text-white rounded-2xl shadow-sm shadow-green-500/10">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-950 tracking-tight">Agregar Producto</h1>
            <p className="text-gray-400 text-xs font-medium mt-0.5">Agrega un nuevo ítem al menú</p>
          </div>
        </div>

        {/* Formulario de Registro Estructurado */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Asignación de Restaurante */}
          <FormCard title="Restaurante" icon={<Tag size={15} />}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Asignar a Restaurante *
              </label>
              <div className="relative">
                <select
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 transition-all appearance-none pr-10 text-gray-700"
                >
                  <option value="">Selecciona un restaurante...</option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </FormCard>

          {/* Card 2: Información del Producto */}
          <FormCard title="Información del Producto" icon={<Info size={15} />}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Nombre del Producto *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-300" 
                placeholder="Ej. Lomo Saltado Clásico" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Descripción</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 h-24 resize-none transition-all placeholder:text-gray-300" 
                placeholder="Describe el producto o sus ingredientes..." 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ⚡ CAMBIADO A SELECT DESPLEGABLE EN ESPAÑOL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Categoría *</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 transition-all appearance-none pr-10 text-gray-700"
                  >
                    <option value="">Selecciona una categoría...</option>
                    <option value="Burgers">Hamburguesas</option>
                    <option value="Chicken">Pollo</option>
                    <option value="Sides">Acompañamientos</option>
                    <option value="Drinks">Bebidas</option>
                    <option value="Ramen">Ramen</option>
                    <option value="Pizza">Pizzas</option>
                    <option value="Starters">Entradas</option>
                    <option value="Desserts">Postres</option>
                    <option value="Bowls">Bowls</option>
                    <option value="Salads">Ensaladas</option>
                    <option value="Pasta">Pastas</option>
                    <option value="BBQ">BBQ</option>
                    <option value="Tacos">Tacos</option>
                    <option value="Burritos">Burritos</option>
                    <option value="Rice Bowls">Bowls de Arroz</option>
                    <option value="Grilled">A la Parrilla</option>
                    <option value="Stews">Guisos</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Calorías (opcional)</label>
                <input 
                  type="number" 
                  value={calories} 
                  onChange={(e) => setCalories(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-300" 
                  placeholder="720" 
                />
              </div>
            </div>
          </FormCard>

          {/* Card 3: Precio en Soles */}
          <FormCard title="Precio" icon={<DollarSign size={15} />}>
            <div className="max-w-xs">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Precio (S/.) *</label>
              <input 
                type="number" 
                step="0.01" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-300" 
                placeholder="S/ 24.90" 
              />
            </div>
          </FormCard>

          {/* Card 4: Imagen */}
          <FormCard title="Imagen del Producto" icon={<ImageIcon size={15} />}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">URL de la Imagen *</label>
              <input 
                type="url" 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-300" 
                placeholder="https://..." 
              />
            </div>
          </FormCard>

          {/* Card 5: Visibilidad en Grilla de 2 Columnas */}
          <FormCard title="Visibilidad" icon={<Eye size={15} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch 
                label="Disponible" 
                description="Visible y listo para ordenar en el menú" 
                checked={isAvailable} 
                onChange={setIsAvailable} 
              />
              <ToggleSwitch 
                label="Marcar como Popular" 
                description="Mostrar insignia destacada en este artículo" 
                checked={isPopular} 
                onChange={setIsPopular} 
              />
            </div>
          </FormCard>

          {/* Bloque de Botones de Control Inferiores */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center gap-2 bg-[#22C55E] hover:bg-green-600 text-white font-bold py-3 px-5 rounded-xl shadow-sm shadow-green-500/10 transition-all text-sm disabled:opacity-50"
            >
              <Plus size={16} />
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
            <button 
              type="button"
              onClick={() => router.push('/admin/products')}
              className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl border border-gray-200 shadow-sm text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}