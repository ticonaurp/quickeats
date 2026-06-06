"use client";

import { Eye } from 'lucide-react';

interface FormVisibilityProps {
  isOpen: boolean;
  isFeatured: boolean;
  onChange: (field: string, value: boolean) => void;
}

export function FormVisibility({ isOpen, isFeatured, onChange }: FormVisibilityProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <Eye size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Visibilidad</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/30">
          <div>
            <p className="text-sm font-bold text-gray-900">Abierto Actualmente</p>
            <p className="text-xs text-gray-400 mt-0.5">El local recibirá pedidos en la aplicación.</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('isOpen', !isOpen)}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 ${
              isOpen ? 'bg-green-500 justify-end' : 'bg-gray-200 justify-start'
            }`}
          >
            <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/30">
          <div>
            <p className="text-sm font-bold text-gray-900">Destacar Comercio</p>
            <p className="text-xs text-gray-400 mt-0.5">Aparecerá en la sección preferencial de la home.</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('isFeatured', !isFeatured)}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 ${
              isFeatured ? 'bg-green-500 justify-end' : 'bg-gray-200 justify-start'
            }`}
          >
            <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}