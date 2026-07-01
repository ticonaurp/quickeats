'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleMap, useJsApiLoader, Autocomplete, MarkerF } from '@react-google-maps/api';

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

const LIMA_CENTER = { lat: -12.046374, lng: -77.042793 };
const GOOGLE_LIBRARIES: "places"[] = ["places"];

// SVG - Color Mango (#FFB800) con icono de una Casa
const HOME_ICON_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path fill="#FFB800" d="M16 0C7.16 0 0 7.16 0 16.3c0 10.3 14.3 24.3 14.9 24.9.6.6 1.5.6 2.1 0 .7-.6 15-14.6 15-24.9C32 7.16 24.84 0 16 0z"/>
    <circle fill="#ffffff" cx="16" cy="16" r="10"/>
    <path fill="#FFB800" d="M16 9l-6 5.25V21h4v-4h4v4h4v-6.75L16 9z"/>
  </svg>
`.trim())}`;

export default function AddressSection({ address, setAddress, onContinue }: AddressSectionProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // El marcador inicia estrictamente en null para que NO aparezca ningún pin al principio
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number } | null>(null);

  // 🔴 CORRECCIÓN CLAVE: Forzamos que el campo se limpie por completo al montar el componente.
  // Esto remueve cualquier texto de prueba previo para que se luzca únicamente el placeholder.
  useEffect(() => {
    setAddress(prev => ({ ...prev, street: "", lat: undefined, lng: undefined }));
  }, [setAddress]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_LIBRARIES,
  });

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  // Traduce coordenadas a texto tras arrastrar el pin manualmente
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!isLoaded || !window.google) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const formattedAddress = results[0].formatted_address;
        setAddress(prev => ({ ...prev, street: formattedAddress, lat, lng }));
      } else {
        setAddress(prev => ({ ...prev, lat, lng }));
      }
    });
  }, [isLoaded, setAddress]);

  // Se ejecuta cuando el cliente selecciona una sugerencia de Google
  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || place.name || "";

        // Al seleccionar la dirección, el marcador se crea y se posiciona en el mapa
        setMarkerPos({ lat, lng });
        setAddress(prev => ({ ...prev, street: formattedAddress, lat, lng }));
      }
    }
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      
      setMarkerPos({ lat: newLat, lng: newLng });
      reverseGeocode(newLat, newLng);
    }
  };

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
        {/* Input con autocompletado */}
        <div>
          <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Dirección de la calle <span className="text-red-500">*</span>
          </label>
          
          {isLoaded ? (
            <Autocomplete 
              onLoad={onAutocompleteLoad} 
              onPlaceChanged={onPlaceChanged}
              options={{ componentRestrictions: { country: "pe" } }}
            >
              <input 
                required
                value={address.street} 
                onChange={e => {
                  const val = e.target.value;
                  setAddress(a => ({ ...a, street: val }));
                  if (val.trim() === "") {
                    setMarkerPos(null); // Si limpian el texto por completo, el pin se remueve
                  }
                }}
                className={inputClass}
                style={{ fontSize: '0.9rem' }} 
                placeholder="Ej. Av. Alfredo Benavides 1234" 
              />
            </Autocomplete>
          ) : (
            <input 
              required
              value={address.street} 
              disabled
              className={inputClass}
              style={{ fontSize: '0.9rem' }} 
              placeholder="Cargando buscador..." 
            />
          )}
        </div>

        {/* Contenedor del Mapa (Fijo y Siempre Visible) */}
        <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative shadow-inner">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={markerPos || LIMA_CENTER} 
              zoom={markerPos ? 16 : 12} 
              options={{
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {/* El marcador solo se dibuja cuando markerPos deja de ser null (al elegir dirección) */}
              {markerPos && typeof window !== 'undefined' && window.google && (
                <MarkerF 
                  position={markerPos} 
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd} 
                  icon={{
                    url: HOME_ICON_SVG,
                    scaledSize: { width: 40, height: 52 } as google.maps.Size,
                    anchor: { x: 20, y: 52 } as google.maps.Point
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">
              Cargando mapa interactivo...
            </div>
          )}
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