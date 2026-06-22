'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RestaurantHeroProps {
  name: string;
  cuisine: string;
  coverImage: string;
}

export default function RestaurantHero({ name, cuisine, coverImage }: RestaurantHeroProps) {
  const router = useRouter();

  return (
    <div className="relative h-[260px] sm:h-[320px] w-full bg-gray-900 overflow-hidden">
      <img 
        src={coverImage} 
        alt={name}
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Botón de Regreso */}
      <button 
        onClick={() => router.push('/user')}
        className="absolute top-4 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors group z-10"
      >
        <ArrowLeft size={18} className="text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Info del Banner */}
      <div className="absolute bottom-12 left-6 sm:left-12 max-w-[1440px] text-white">
        <h1 className="font-black text-3xl sm:text-4xl tracking-tight">{name}</h1>
        <p className="text-white/80 text-sm mt-1 font-medium">{cuisine}</p>
      </div>
    </div>
  );
}