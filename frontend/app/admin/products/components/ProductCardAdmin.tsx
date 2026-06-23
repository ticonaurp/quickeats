'use client';

import { Edit2, Trash2, Flame, EyeOff, Eye } from 'lucide-react';

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
      className={`group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs transition-all duration-300 ${
        !product.isAvailable ? 'opacity-70 grayscale-[0.5]' : 'hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1'
      }`}
    >
      {/* Contenedor de Imagen con Overlay sutil */}
      <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Etiqueta Popular (Gradiente Mango Oficial) */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {product.isPopular && (
            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-orange-500 shadow-lg shadow-orange-500/20">
              <Flame size={12} className="fill-white" /> Popular
            </span>
          )}
        </div>

        {/* Etiqueta Estado (Look Glassmorphic) */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
              product.isAvailable
                ? 'text-amber-700 bg-amber-50/80 border-amber-200/50'
                : 'text-slate-500 bg-slate-100/80 border-slate-200/50'
                }`}
          >
            {product.isAvailable ? '• Activo' : '• Oculto'}
          </span>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-black text-slate-900 text-lg truncate tracking-tight font-poppins">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider truncate mt-0.5">
            {restaurantName || 'Sucursal QuickEats'}
          </p>
        </div>
        
        {/* Precio y Categoría con contraste Slate/Amber */}
        <div className="flex items-center justify-between">
          <span className="font-black text-slate-900 text-xl tracking-tighter">
            <span className="text-amber-500 text-sm mr-1">S/</span>
            {product.price.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg font-black uppercase tracking-tighter">
            {product.category}
          </span>
        </div>

        {/* Fila de Botones de Acción Estilizados */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 hover:border-amber-400 hover:text-amber-600 transition-all active:scale-95"
          >
            <Edit2 size={14} strokeWidth={2.5} /> Editar
          </button>
          
          <button
            onClick={onToggleVisibility}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-xl text-xs font-black transition-all active:scale-95 ${
                product.isAvailable 
                ? 'border-slate-200 text-slate-600 hover:bg-slate-50' 
                : 'border-amber-200 text-amber-600 bg-amber-50/50 hover:bg-amber-50'
            }`}
          >
            {product.isAvailable ? <EyeOff size={14} strokeWidth={2.5} /> : <Eye size={14} strokeWidth={2.5} />}
            {product.isAvailable ? 'Ocultar' : 'Mostrar'}
          </button>

          <button
            onClick={onDeleteTrigger}
            className="p-2.5 border border-slate-200 rounded-xl text-slate-300 bg-white hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all active:scale-95 flex items-center justify-center"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}