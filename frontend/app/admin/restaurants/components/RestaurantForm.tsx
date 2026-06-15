"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, Store, Image as ImageIcon } from 'lucide-react';

// Subcomponentes Atómicos
import { FormBasicInfo } from './FormBasicInfo';
import { FormLocation } from './FormLocation';
import { FormDelivery } from './FormDelivery';
import { FormVisibility } from './FormVisibility';
import { FormHours, OpeningHour } from './FormHours';

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
    // 🌟 Agregamos los 7 días inicializados por defecto (0 = Domingo, 1 = Lunes...)
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
          const response = await fetch(`${baseUrl}/restaurants/${id}`); // 👈 Cambiado
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

  // 3. Modificamos el Submit para que guarde de verdad en tu backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validamos que los campos requeridos (incluyendo la nueva imagen) no estén vacíos
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
      // Determinamos si es un POST (Crear) o PATCH (Editar, estándar en NestJS)
      const url = isEdit
        ? `${baseUrl}/restaurants/${id}` // 👈 Cambiado
        : `${baseUrl}/restaurants`; // 👈 Cambiado

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
    <div className="max-w-3xl w-full mx-auto font-sans antialiased text-gray-900">
      <button
        onClick={() => router.push('/admin/restaurants')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Volver a Restaurantes
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-green-500/10 bg-[#22C55E]">
          <Store size={22} />
        </div>
        <div>
          <h1 className="font-black text-2xl text-gray-900 tracking-tight">
            {isEdit ? 'Editar Restaurante' : 'Agregar Restaurante'}
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-0.5">
            {isEdit ? `Modificando la información de: ${form.name}` : 'Registra un nuevo establecimiento en la plataforma.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <FormBasicInfo
          name={form.name} description={form.description} category={form.category}
          onChange={handleValueChange}
        />

        <FormLocation
          address={form.address}
          onChange={(val) => handleValueChange('address', val)}
        />

        {/* 📷 NUEVO BLOQUE: SECCIÓN DE LA IMAGEN OBLIGATORIA */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
            <ImageIcon size={18} className="text-gray-400" />
            <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wider">Imagen del Establecimiento</h2>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase">URL de la Imagen</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/photo-..."
              required
              value={form.image}
              onChange={(e) => handleValueChange('image', e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 transition-colors w-full bg-gray-50/30"
            />
          </div>

          {/* Vista previa en tiempo real */}
          {form.image && (
            <div className="pt-2 animate-fade-in">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Vista previa de la foto:</p>
              <img
                src={form.image}
                alt="Preview"
                className="w-32 h-32 rounded-xl object-cover border border-gray-100 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&q=80';
                }}
              />
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

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] text-white font-bold text-sm rounded-xl hover:opacity-95 transition-all shadow-sm shadow-green-500/10 disabled:opacity-70"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} /> {isEdit ? 'Guardar Cambios' : 'Crear Restaurante'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/restaurants')}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}