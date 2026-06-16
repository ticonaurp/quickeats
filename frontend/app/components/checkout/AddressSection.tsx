'use client';

import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface AddressData {
  street: string;
  notes: string;
}

interface AddressSectionProps {
  address: AddressData;
  setAddress: React.Dispatch<React.SetStateAction<AddressData>>;
  onContinue: () => void; // ◄— Esta es la acción que dispara el cambio de vista en el padre
}

export default function AddressSection({ address, setAddress, onContinue }: AddressSectionProps) {
  
  // Manejador del envío para controlar que toda la acción empiece aquí
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(); // Dispara la transición hacia el paso de pago
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#22C55E]/10 rounded-xl flex items-center justify-center">
          <MapPin size={18} className="text-[#22C55E]" />
        </div>
        <h2 style={{ fontWeight: 700, color: '#0F172A' }}>Dirección de Entrega</h2>
      </div>

      {/* Envuelto en un tag form para capturar correctamente la acción del botón */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Dirección de la calle
          </label>
          <input 
            required
            value={address.street} 
            onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 text-gray-900"
            style={{ fontSize: '0.9rem' }} 
            placeholder="Ej. Av. Alfredo Benavides 1234" 
          />
        </div>

        {/* 🗺️ Contenedor del Mapa */}
        <div className="w-full h-44 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-1.5 overflow-hidden select-none">
          <MapPin size={22} className="text-gray-400/80 animate-pulse" />
          <span className="text-[0.72rem] font-bold uppercase tracking-wider text-gray-400">Mapa de Google Maps</span>
        </div>

        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Notas de entrega (opcional)
          </label>
          <textarea 
            value={address.notes} 
            onChange={e => setAddress(a => ({ ...a, notes: e.target.value }))}
            placeholder="Nro. de departamento, piso, instrucciones especiales para el repartidor..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 text-gray-900 resize-none"
            style={{ fontSize: '0.9rem' }} 
          />
        </div>

        {/* 🟢 El botón ahora dice exactamente "Proceder al pago" y activa el flujo al presionarse */}
        <button 
          type="submit"
          className="mt-2 w-full py-4 bg-[#22C55E] text-white rounded-2xl hover:bg-[#16A34A] transition-colors shadow-lg shadow-green-200" 
          style={{ fontWeight: 700 }}
        >
          Proceder al pago →
        </button>
      </form>
    </motion.div>
  );
}