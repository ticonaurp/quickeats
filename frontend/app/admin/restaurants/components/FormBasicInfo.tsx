"use client";

import { Store } from 'lucide-react';

interface FormBasicInfoProps {
  name: string;
  description: string;
  category: string;
  onChange: (field: string, value: string) => void;
}

const CATEGORIES = ['Burgers', 'Pizza', 'Asiática', 'Italiana', 'Chifa', 'Pollerías', 'Saludable', 'Postres'];
const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/10 transition-all shadow-sm";

export function FormBasicInfo({ name, description, category, onChange }: FormBasicInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <Store size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Información Básica</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Nombre del Restaurante <span className="text-red-500">*</span>
          </label>
          <input 
            value={name} 
            onChange={(e) => onChange('name', e.target.value)} 
            required
            placeholder="Ej. The Burger Lab" 
            className={inputClass} 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea 
            value={description} 
            onChange={(e) => onChange('description', e.target.value)} 
            required
            placeholder="Breve descripción de las especialidades..."
            rows={3} 
            className={`${inputClass} resize-none`} 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select 
            value={category} 
            onChange={(e) => onChange('category', e.target.value)} 
            className={`${inputClass} cursor-pointer`}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}