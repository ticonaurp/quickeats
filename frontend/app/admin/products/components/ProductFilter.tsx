'use client';

import { Search } from 'lucide-react';

interface RestaurantOption {
  id: string;
  name: string;
}

interface ProductFilterProps {
  search: string;
  setSearch: (value: string) => void;
  activeRestaurant: string;
  setActiveRestaurant: (value: string) => void;
  restaurants: RestaurantOption[];
}

export function ProductFilter({ search, setSearch, activeRestaurant, setActiveRestaurant, restaurants }: ProductFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="relative flex-1 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          // 🛠️ SE AÑADIÓ: text-gray-900 y placeholder-gray-400 de forma explícita
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-400 transition-colors shadow-sm"
        />
      </div>
      <select
        value={activeRestaurant}
        onChange={(e) => setActiveRestaurant(e.target.value)}
        // 🛠️ SE AÑADIÓ: text-gray-900 de forma explícita
        className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-green-400 cursor-pointer shadow-sm"
      >
        <option value="all" className="text-gray-900">Todos los restaurantes</option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id} className="text-gray-900">
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}