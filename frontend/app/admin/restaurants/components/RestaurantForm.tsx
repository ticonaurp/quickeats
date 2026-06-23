"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, Store, Image as ImageIcon } from 'lucide-react';

// Subcomponentes Atómicos
import { FormBasicInfo } from './FormBasicInfo';
import { FormLocation } from './FormLocation';
import { FormDelivery } from './FormDelivery';
import { FormVisibility } from './FormVisibility';
import { FormHours } from './FormHours';

export function RestaurantForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEdit = !!id;

  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Añadimos el campo obligatorio 'image' al estado del formulario
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Burgers',
    address: '',
    deliveryTime: '30',
    deliveryFee: '5.00',
    isOpen: true,
    isFeatured: false,
    image: '',
    // 🌟 Agregamos los 7 días inicializados por defecto
    openingHours: Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      openTime: '09:00',
      closeTime: '22:00'
    }))
  });

  // 🌐 Base URL dinámica para el componente (Render o Local)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // 2. Traer data real del Gateway si estamos en modo Edición
  useEffect(() => {
    setMounted(true);

    if (isEdit && id) {
      const loadRestaurantData = async () => {
        try {
          const response = await fetch(`${baseUrl}/restaurants/${id}`);
          if (response.ok) {
            const existing = await response.json();
            setForm({
              ...existing,
              deliveryTime: existing.deliveryTime.toString(),
              deliveryFee: existing.deliveryFee.toString(),
              // 🌟 Cargamos las horas que provienen de la relación de Prisma
              openingHours: existing.openingHours && existing.openingHours.length > 0
                ? existing.openingHours.map((h: any) => ({
                    dayOfWeek: h.dayOfWeek,
                    openTime: h.openTime,
                    closeTime: h.closeTime
                  }))
                : form.openingHours // Fallback si no tuviera registros previos
            });
          } else {
            console.error("No se pudo obtener el restaurante de la base de datos");
          }
        } catch (error) {
          console.error("Error conectando al Gateway para edición:", error);
        }
      };

      loadRestaurantData();
    }
  }, [isEdit, id, baseUrl]);

  const handleValueChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // 3. Modificamos el Submit para que guarde con persistencia real en el backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.image) {
      alert("Por favor, completa todos los campos obligatorios, incluyendo la imagen.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      deliveryTime: parseInt(form.deliveryTime) || 0,
      deliveryFee: parseFloat(form.deliveryFee) || 0.0,
    };

    try {
      const url = isEdit
        ? `${baseUrl}/restaurants/${id}`
        : `${baseUrl}/restaurants`;

      const method = isEdit ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/restaurants');
      } else {
        const errorData = await response.json();
        alert(`Error del Servidor: ${errorData.message || 'No se pudo guardar el restaurante'}`);
      }
    } catch (error) {
      console.error("Error de red al intentar guardar:", error);
      alert("Error de conexión con el Gateway.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-3xl w-full mx-auto font-sans antialiased text-slate-900 px-4 py-2 space-y-6">
      
      {/* Botón de retorno limpio */}
      <button
        onClick={() => router.push('/admin/restaurants')}
        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-amber-500 transition-colors group"
      >
        <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
        Volver a Restaurantes
      </button>

      {/* Encabezado del Formulario */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-500/10 bg-linear-to-br from-amber-500 to-orange-500">
          <Store size={22} />
        </div>
        <div>
          <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight font-poppins">
            {isEdit ? 'Editar Establecimiento' : 'Nuevo Establecimiento'}
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            {isEdit ? `Modificando la información de de: ${form.name}` : 'Registra un nuevo local bajo la identidad Mango de QuickEats.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Info básica interna */}
        <FormBasicInfo
          name={form.name} description={form.description} category={form.category}
          onChange={handleValueChange}
        />

        <FormLocation
          address={form.address}
          onChange={(val) => handleValueChange('address', val)}
        />

        {/* 📷 SECCIÓN DE LA IMAGEN RE-ESTILIZADA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ImageIcon size={16} className="text-slate-400" />
            <h2 className="font-black text-xs text-slate-700 uppercase tracking-widest font-sans">Imagen de Portada</h2>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wide">URL de la Imagen (Unsplash, Postimg o Cloud)</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/photo-..."
              required
              value={form.image}
              onChange={(e) => handleValueChange('image', e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all w-full bg-slate-50/30"
            />
          </div>

          {/* Vista previa mejorada estilo Tarjeta Flotante */}
          {form.image && (
            <div className="pt-2 flex flex-col gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Previsualización de banner:</p>
              <div className="relative w-full max-w-sm h-40 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80';
                  }}
                />
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                  Live View
                </div>
              </div>
            </div>
          )}
        </div>

        <FormDelivery
          deliveryTime={form.deliveryTime} deliveryFee={form.deliveryFee}
          onChange={handleValueChange}
        />

        <FormHours
          openingHours={form.openingHours}
          onChange={(updatedHours) => setForm(prev => ({ ...prev, openingHours: updatedHours }))}
        />

        <FormVisibility
          isOpen={form.isOpen} isFeatured={form.isFeatured}
          onChange={handleValueChange}
        />

        {/* 🥭 BOTONES DE ACCIÓN UNIFICADOS */}
        <div className="flex gap-3 pt-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white font-black text-sm rounded-xl hover:opacity-95 transition-all shadow-md shadow-orange-500/10 disabled:opacity-70 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando en base de datos...
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.5} /> {isEdit ? 'Guardar Configuración' : 'Registrar Local'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/restaurants')}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-500 font-extrabold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-xs"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}