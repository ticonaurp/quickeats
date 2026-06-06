"use client";

import { Clock } from 'lucide-react';

interface FormDeliveryProps {
  deliveryTime: string;
  deliveryFee: string;
  onChange: (field: string, value: string) => void;
}

const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/10 transition-all shadow-sm";

export function FormDelivery({ deliveryTime, deliveryFee, onChange }: FormDeliveryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <Clock size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Configuración de Entrega</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Tiempo de Entrega Promedio (Minutos) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number"
            min="1"
            required
            value={deliveryTime} 
            onChange={(e) => onChange('deliveryTime', e.target.value)} 
            placeholder="Ej. 30" 
            className={inputClass} 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Costo de Envío Base (S/) <span className="text-red-500">*</span>
          </label>
          <input 
            type="number"
            min="0"
            step="0.10"
            required
            value={deliveryFee} 
            onChange={(e) => onChange('deliveryFee', e.target.value)} 
            placeholder="Ej. 5.00" 
            className={inputClass} 
          />
        </div>
      </div>
    </div>
  );
}