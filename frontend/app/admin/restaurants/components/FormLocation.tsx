"use client";

import { MapPin } from 'lucide-react';

interface FormLocationProps {
  address: string;
  onChange: (value: string) => void;
}

const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/10 transition-all shadow-sm";

export function FormLocation({ address, onChange }: FormLocationProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <MapPin size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Ubicación</h3>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
          Dirección del Local <span className="text-red-500">*</span>
        </label>
        <input 
          value={address} 
          onChange={(e) => onChange(e.target.value)} 
          required
          placeholder="Ej. Av. Larco 456, Miraflores" 
          className={inputClass} 
        />
      </div>
    </div>
  );
}