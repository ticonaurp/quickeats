'use client';

import { Edit2, Trash2, Flame } from 'lucide-react';

interface ProductData {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  isPopular?: boolean;
  isAvailable: boolean;
}

interface ProductCardAdminProps {
  product: ProductData;
  restaurantName?: string;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDeleteTrigger: () => void;
}

export function ProductCardAdmin({
  product,
  restaurantName,
  onEdit,
  onToggleVisibility,
  onDeleteTrigger,
}: ProductCardAdminProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm transition-all duration-200 ${
        !product.isAvailable ? 'opacity-60' : 'hover:shadow-md'
      }`}
    >
      {/* Contenedor de Imagen */}
      <div className="relative h-40 w-full bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Etiqueta Popular (Fondo verde sólido con texto blanco) */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {product.isPopular && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1 bg-[#22C55E]">
              <Flame size={12} className="fill-white" /> Popular
            </span>
          )}
        </div>

        {/* Etiqueta Estado (Texto verde oscuro sobre fondo verde menta suave) */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              product.isAvailable
                ? 'text-[#166534] bg-[#DCFCE7]'
                : 'text-gray-600 bg-gray-100'
                }`}
          >
            {product.isAvailable ? 'Activo' : 'Oculto'}
          </span>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-4">
        {/* Título y Restaurante con pesos limpios y tipografía nativa */}
        <h3 className="font-bold text-gray-900 text-base truncate tracking-tight">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 font-medium truncate mt-0.5 mb-2">
          {restaurantName || 'Restaurante Desconocido'}
        </p>
        
        {/* Precio y Categoría alineados */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg">
            S/. {product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
            {product.category}
          </span>
        </div>

        {/* Fila de Botones de Acción (Idéntica al Figma: bordes delgados, esquinas redondeadas) */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <Edit2 size={12} /> Editar
          </button>
          <button
            onClick={onToggleVisibility}
            className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            {product.isAvailable ? 'Ocultar' : 'Mostrar'}
          </button>
          <button
            onClick={onDeleteTrigger}
            className="p-2 border border-gray-200 rounded-xl text-gray-400 bg-white hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}