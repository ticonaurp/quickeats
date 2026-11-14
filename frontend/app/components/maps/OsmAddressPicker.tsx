'use client';

/**
 * Buscador de direcciones + mapa con OpenStreetMap (100% gratuito, sin API key).
 * - Mapa: Leaflet con teselas de OpenStreetMap.
 * - Autocompletado y geocodificación inversa: Photon (photon.komoot.io), basado en datos de OSM.
 * El campo de texto SIEMPRE es editable: si el servicio de búsqueda falla, el usuario puede
 * escribir la dirección a mano y el flujo (checkout / formulario admin) no se bloquea.
 */

import 'leaflet/dist/leaflet.css';
import { useEffect, useId, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';

export interface Coords {
  lat: number;
  lng: number;
}

interface Suggestion {
  label: string;
  coords: Coords;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    locality?: string;
    city?: string;
    county?: string;
    state?: string;
  };
}

interface OsmAddressPickerProps {
  value: string;
  onChange: (text: string, coords: Coords | null) => void;
  /** Coordenadas iniciales del pin (si ya se conocen). */
  initialCoords?: Coords | null;
  /** 'home' = casita (checkout), 'restaurant' = cubiertos (admin). */
  pinVariant?: 'home' | 'restaurant';
  placeholder?: string;
  inputClassName: string;
  inputStyle?: React.CSSProperties;
  mapHeightClassName?: string;
  required?: boolean;
}

const LIMA_CENTER: Coords = { lat: -12.046374, lng: -77.042793 };
// Caja aproximada de Perú (oeste, sur, este, norte) para limitar las sugerencias.
const PERU_BBOX = '-81.4,-18.4,-68.6,-0.03';
const PHOTON_URL = 'https://photon.komoot.io';

const PIN_PATHS = {
  home: '<path fill="#FFB800" d="M16 9l-6 5.25V21h4v-4h4v4h4v-6.75L16 9z"/>',
  restaurant:
    '<path fill="#FFB800" d="M13 11v3c0 .6-.4 1-1 1h-1v3h-1v-3H9c-.6 0-1-.4-1-1v-3h1v2h1v-2h1v2h1v-2h1zm5 0h1c1.1 0 2 .9 2 2v2h-1v3h-1v-3h-1v-4z"/>',
};

function pinSvg(variant: 'home' | 'restaurant'): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="40" height="52">
      <path fill="#FFB800" d="M16 0C7.16 0 0 7.16 0 16.3c0 10.3 14.3 24.3 14.9 24.9.6.6 1.5.6 2.1 0 .7-.6 15-14.6 15-24.9C32 7.16 24.84 0 16 0z"/>
      <circle fill="#ffffff" cx="16" cy="16" r="10"/>
      ${PIN_PATHS[variant]}
    </svg>`;
}

// Arma un texto legible a partir de la respuesta de Photon, sin repetir partes.
function formatFeature(f: PhotonFeature): string {
  const p = f.properties;
  const streetLine = p.street ? `${p.street}${p.housenumber ? ` ${p.housenumber}` : ''}` : '';
  const parts = [
    p.name && p.name !== p.street ? p.name : '',
    streetLine,
    p.district || p.locality || '',
    p.city || p.county || '',
  ].filter(Boolean);
  return [...new Set(parts)].join(', ');
}

function toSuggestion(f: PhotonFeature): Suggestion {
  const [lng, lat] = f.geometry.coordinates;
  return { label: formatFeature(f), coords: { lat, lng } };
}

export default function OsmAddressPicker({
  value,
  onChange,
  initialCoords = null,
  pinVariant = 'home',
  placeholder,
  inputClassName,
  inputStyle,
  mapHeightClassName = 'h-48',
  required = false,
}: OsmAddressPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const leafletRef = useRef<typeof import('leaflet') | null>(null);
  const onChangeRef = useRef(onChange);
  const skipNextSearchRef = useRef(false);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  }, [onChange, value]);

  // Geocodificación inversa: coordenadas → texto (al arrastrar el pin o hacer clic en el mapa).
  // Si no se encuentra un nombre para el punto, se conserva el texto que ya había escrito.
  const reverseGeocode = async (coords: Coords) => {
    let label = '';
    try {
      const res = await fetch(`${PHOTON_URL}/reverse?lat=${coords.lat}&lon=${coords.lng}`);
      const data = await res.json();
      const feature: PhotonFeature | undefined = data?.features?.[0];
      if (feature) label = formatFeature(feature);
    } catch {
      // Sin conexión con Photon: guardamos solo las coordenadas.
    }
    skipNextSearchRef.current = true;
    onChangeRef.current(label || valueRef.current, coords);
  };
  const reverseGeocodeRef = useRef(reverseGeocode);

  // Coloca (o mueve) el pin y centra el mapa.
  const placeMarker = (coords: Coords, zoom = 16) => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (!markerRef.current) {
      const icon = L.divIcon({
        html: pinSvg(pinVariant),
        className: '', // sin estilos por defecto de Leaflet (fondo blanco)
        iconSize: [40, 52],
        iconAnchor: [20, 52],
      });
      markerRef.current = L.marker([coords.lat, coords.lng], { draggable: true, icon }).addTo(map);
      markerRef.current.on('dragend', () => {
        const pos = markerRef.current!.getLatLng();
        reverseGeocodeRef.current({ lat: pos.lat, lng: pos.lng });
      });
    } else {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
    }
    map.setView([coords.lat, coords.lng], zoom);
  };
  const placeMarkerRef = useRef(placeMarker);

  // Mantiene las referencias apuntando a la versión más reciente de cada función.
  useEffect(() => {
    reverseGeocodeRef.current = reverseGeocode;
    placeMarkerRef.current = placeMarker;
  });

  // 🗺️ Inicializa Leaflet solo en el navegador (no funciona en el render del servidor).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = await import('leaflet');
      if (cancelled || !mapContainerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const start = initialCoords ?? LIMA_CENTER;
      const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(
        [start.lat, start.lng],
        initialCoords ? 16 : 12,
      );
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Clic en el mapa = mover el pin a ese punto.
      map.on('click', (e) => {
        const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
        placeMarkerRef.current(coords, map.getZoom());
        reverseGeocodeRef.current(coords);
      });

      mapRef.current = map;
      if (initialCoords) placeMarkerRef.current(initialCoords);
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // initialCoords solo se usa al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔎 Autocompletado con debounce (400 ms) para no saturar el servicio gratuito.
  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    const q = value.trim();
    if (q.length < 3) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const url =
          `${PHOTON_URL}/api/?q=${encodeURIComponent(q)}&limit=5` +
          `&lat=${LIMA_CENTER.lat}&lon=${LIMA_CENTER.lng}&bbox=${PERU_BBOX}`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        const results: Suggestion[] = (data?.features ?? [])
          .map(toSuggestion)
          .filter((s: Suggestion) => s.label);
        setSuggestions(results);
        // Solo se despliega si el usuario está escribiendo (evita abrirlo al cargar un formulario de edición).
        setOpen(results.length > 0 && document.activeElement === inputRef.current);
      } catch {
        // Abortado o sin conexión: el campo sigue funcionando como texto libre.
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  const handleSelect = (s: Suggestion) => {
    skipNextSearchRef.current = true;
    setOpen(false);
    setSuggestions([]);
    placeMarker(s.coords);
    onChange(s.label, s.coords);
  };

  return (
    <div className="space-y-3">
      {/* Campo de dirección con sugerencias */}
      <div className="relative">
        <input
          ref={inputRef}
          required={required}
          value={value}
          onChange={(e) => {
            if (e.target.value.trim().length < 3) {
              setSuggestions([]);
              setOpen(false);
            }
            onChange(e.target.value, null);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className={inputClassName}
          style={inputStyle}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
        />
        {searching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-200 border-t-[#F97316] rounded-full animate-spin" />
        )}

        {open && suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-1000 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
          >
            {suggestions.map((s, i) => (
              <li key={`${s.label}-${i}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#EA580C] transition-colors"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa */}
      <div
        className={`w-full ${mapHeightClassName} rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative shadow-inner z-0`}
      >
        <div ref={mapContainerRef} className="w-full h-full" />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium">
            Cargando mapa interactivo...
          </div>
        )}
      </div>
      <p className="text-[11px] text-gray-400">
        Busca tu dirección o haz clic en el mapa. Puedes arrastrar el pin para ajustar la ubicación.
      </p>
    </div>
  );
}
