"use client";

import { useState, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Autocomplete, MarkerF } from '@react-google-maps/api';

interface FormLocationProps {
  address: string;
  // Callback obligatorio para enviar los datos de vuelta al formulario padre
  onChange: (value: string, lat: number, lng: number) => void;
  latitude?: number;
  longitude?: number;
}

const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/10 transition-all shadow-sm";

// Coordenadas por defecto (Lima, Perú)
const LIMA_CENTER = { lat: -12.046374, lng: -77.042793 };
const GOOGLE_LIBRARIES: "places"[] = ["places"];

// SVG limpio y codificado correctamente con el color Mango (#FFB800)
const RESTAURANT_ICON_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path fill="#FFB800" d="M16 0C7.16 0 0 7.16 0 16.3c0 10.3 14.3 24.3 14.9 24.9.6.6 1.5.6 2.1 0 .7-.6 15-14.6 15-24.9C32 7.16 24.84 0 16 0z"/>
    <circle fill="#ffffff" cx="16" cy="16" r="10"/>
    <path fill="#FFB800" d="M13 11v3c0 .6-.4 1-1 1h-1v3h-1v-3H9c-.6 0-1-.4-1-1v-3h1v2h1v-2h1v2h1v-2h1zm5 0h1c1.1 0 2 .9 2 2v2h-1v3h-1v-3h-1v-4z"/>
  </svg>
`.trim())}`;

export function FormLocation({ address, onChange, latitude, longitude }: FormLocationProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  // Inicialización estable del marcador para garantizar que nunca sea null
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>(() => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      return { lat: latitude, lng: longitude };
    }
    return LIMA_CENTER;
  });

  // Cargador oficial de Google Maps
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_LIBRARIES,
  });

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  // Función para traducir coordenadas a texto plano (Geocodificación Inversa)
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!isLoaded || !window.google) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const formattedAddress = results[0].formatted_address;
        onChange(formattedAddress, lat, lng);
      } else {
        console.error("Geocodificación inversa falló:", status);
        onChange(address, lat, lng);
      }
    });
  }, [isLoaded, onChange, address]);

  // Acción cuando se selecciona una sugerencia del buscador predictivo
  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || place.name || "";

        const newPosition = { lat, lng };
        setMarkerPos(newPosition);
        onChange(formattedAddress, lat, lng);
      }
    }
  };

  // Acción cuando se termina de arrastrar el marcador con el mouse
  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      
      setMarkerPos({ lat: newLat, lng: newLng });
      reverseGeocode(newLat, newLng);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
        <MapPin size={16} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Ubicación del Local</h3>
      </div>

      {/* Campo de búsqueda predictiva */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
          Dirección del Local <span className="text-red-500">*</span>
        </label>
        
        {isLoaded ? (
          <Autocomplete 
            onLoad={onAutocompleteLoad} 
            onPlaceChanged={onPlaceChanged}
            options={{ componentRestrictions: { country: "pe" } }}
          >
            <input 
              value={address} 
              onChange={(e) => onChange(e.target.value, markerPos.lat, markerPos.lng)} 
              required
              placeholder="Ej. Av. Larco 456, Miraflores" 
              className={inputClass} 
            />
          </Autocomplete>
        ) : (
          <input 
            value={address} 
            disabled 
            placeholder="Cargando buscador de Google Maps..." 
            className={inputClass} 
          />
        )}
      </div>

      {/* Contenedor del Mapa */}
      <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={markerPos}
            zoom={15}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            {/* Marcador configurado con literales puros, evitando bloqueos de window */}
            <MarkerF 
              position={markerPos} 
              draggable={true}
              onDragEnd={handleMarkerDragEnd} 
              icon={{
                url: RESTAURANT_ICON_SVG,
                scaledSize: { width: 40, height: 52 } as google.maps.Size,
                anchor: { x: 20, y: 52 } as google.maps.Point
              }}
            />
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            Cargando mapa interactivo...
          </div>
        )}
      </div>
    </div>
  );
}