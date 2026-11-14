"use client";

import { MapPin } from 'lucide-react';
import OsmAddressPicker from '@/app/components/maps/OsmAddressPicker';

interface FormLocationProps {
  address: string;
  // Callback obligatorio para enviar los datos de vuelta al formulario padre
  onChange: (value: string, lat?: number, lng?: number) => void;
  latitude?: number;
  longitude?: number;
}

const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/10 transition-all shadow-sm";

export function FormLocation({ address, onChange, latitude, longitude }: FormLocationProps) {
  const initialCoords =
    latitude && longitude && !isNaN(latitude) && !isNaN(longitude)
      ? { lat: latitude, lng: longitude }
      : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <MapPin size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Ubicación del Local</h3>
      </div>

      {/* Buscador + mapa (OpenStreetMap, gratuito) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
          Dirección del Local <span className="text-red-500">*</span>
        </label>
        <OsmAddressPicker
          required
          value={address}
          onChange={(text, coords) => onChange(text, coords?.lat, coords?.lng)}
          initialCoords={initialCoords}
          pinVariant="restaurant"
          placeholder="Ej. Av. Larco 456, Miraflores"
          inputClassName={inputClass}
          mapHeightClassName="h-64"
        />
      </div>
    </div>
  );
}
