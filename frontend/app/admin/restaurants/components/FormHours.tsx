"use client";

import { Clock, Calendar } from 'lucide-react';

export interface OpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

interface FormHoursProps {
  openingHours: OpeningHour[];
  onChange: (updatedHours: OpeningHour[]) => void;
}

const DAYS_NAME = [
  'Domingo', 
  'Lunes', 
  'Martes', 
  'Miércoles', 
  'Jueves', 
  'Viernes', 
  'Sábado'
];

const inputTimeClass = "px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/10 transition-all shadow-xs cursor-pointer";

export function FormHours({ openingHours, onChange }: FormHoursProps) {
  
  // Función interna para manejar el cambio de hora de un día específico
  const handleTimeChange = (dayIndex: number, field: 'openTime' | 'closeTime', value: string) => {
    // Clonamos el arreglo actual para evitar mutaciones directas
    const updated = [...openingHours];
    const existingIndex = updated.findIndex(h => h.dayOfWeek === dayIndex);

    if (existingIndex > -1) {
      // Si el día ya tiene registro, actualizamos su valor
      updated[existingIndex] = {
        ...updated[existingIndex],
        [field]: value
      };
    } else {
      // Si no existía (por seguridad), creamos el objeto base y le asignamos el valor
      updated.push({
        dayOfWeek: dayIndex,
        openTime: field === 'openTime' ? value : '09:00',
        closeTime: field === 'closeTime' ? value : '22:00'
      });
    }

    // Ordenamos el arreglo de 0 a 6 para que siempre guarde un orden correlativo de días
    updated.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      {/* Cabecera del bloque */}
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <Calendar size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
          Horarios de Atención Semanal
        </h3>
      </div>

      {/* Lista de días */}
      <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
        {DAYS_NAME.map((dayName, index) => {
          // Buscamos si el día actual ya está configurado en el estado del formulario
          const dayConfig = openingHours.find(h => h.dayOfWeek === index) || {
            dayOfWeek: index,
            openTime: '09:00',
            closeTime: '22:00'
          };

          return (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-gray-50/30 border border-gray-100/50 hover:bg-gray-50 transition-colors gap-3"
            >
              {/* Nombre del Día */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <Clock size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm font-bold text-gray-700">{dayName}</span>
              </div>

              {/* Selectores de Rango de Horas */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Abre:</span>
                  <input 
                    type="time" 
                    value={dayConfig.openTime}
                    onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                    className={inputTimeClass}
                  />
                </div>

                <span className="text-gray-300 font-light">|</span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Cierra:</span>
                  <input 
                    type="time" 
                    value={dayConfig.closeTime}
                    onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                    className={inputTimeClass}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-gray-400 font-medium italic mt-1">
        * Nota: Los cambios guardados se aplicarán de inmediato para controlar la disponibilidad automática de la tienda.
      </p>
    </div>
  );
}