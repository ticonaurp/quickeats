'use client';

import { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import OsmAddressPicker from '../maps/OsmAddressPicker';

interface AddressData {
  street: string;
  notes: string;
  lat?: number;
  lng?: number;
}

interface AddressSectionProps {
  address: AddressData;
  setAddress: React.Dispatch<React.SetStateAction<AddressData>>;
  onContinue: () => void;
}

export default function AddressSection({ address, setAddress, onContinue }: AddressSectionProps) {
  // 🔴 CORRECCIÓN CLAVE: Forzamos que el campo se limpie por completo al montar el componente.
  // Esto remueve cualquier texto de prueba previo para que se luzca únicamente el placeholder.
  useEffect(() => {
    setAddress(prev => ({ ...prev, street: "", lat: undefined, lng: undefined }));
  }, [setAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 text-gray-900";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
          <MapPin size={18} className="text-[#F97316]" />
        </div>
        <h2 style={{ fontWeight: 700, color: '#0F172A' }}>Dirección de Entrega</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dirección con autocompletado + mapa (OpenStreetMap, gratuito) */}
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Dirección de la calle <span className="text-red-500">*</span>
          </label>
          <OsmAddressPicker
            required
            value={address.street}
            onChange={(text, coords) =>
              setAddress(a => ({ ...a, street: text, lat: coords?.lat, lng: coords?.lng }))
            }
            pinVariant="home"
            placeholder="Ej. Av. Alfredo Benavides 1234"
            inputClassName={inputClass}
            inputStyle={{ fontSize: '0.9rem' }}
            mapHeightClassName="h-48"
          />
        </div>

        {/* Notas adicionales */}
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Notas de entrega (opcional)
          </label>
          <textarea
            value={address.notes}
            onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))}
            placeholder="Nro. de departamento, piso, instrucciones especiales para el repartidor..."
            rows={2}
            className={`${inputClass} resize-none`}
            style={{ fontSize: '0.9rem' }}
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-4 bg-[#F97316] text-white rounded-2xl hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-200"
          style={{ fontWeight: 700 }}
        >
          Proceder al pago →
        </button>
      </form>
    </motion.div>
  );
}
