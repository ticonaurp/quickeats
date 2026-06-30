'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Bike, Shield, Smartphone, Zap, Lock, UtensilsCrossed, Star, MapPin, Search, ShoppingBag } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { fetchFromGateway } from './services/api';
import { Restaurant } from './data/mockData';

export default function Home() {
  const [featured, setFeatured] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedRestaurants() {
      try {
        const data = await fetchFromGateway('/restaurants');
        if (isMounted && data && Array.isArray(data)) {
          const featuredItems = data.filter((r: Restaurant) => r.isFeatured);
          setFeatured(featuredItems.length > 0 ? featuredItems : data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error conectando con el Gateway desde la Landing Page:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFeaturedRestaurants();

    const interval = setInterval(() => {
      loadFeaturedRestaurants();
    }, 20000); // 🕒 Protegemos el Gateway con 20s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const cravings = [
    { name: 'Burgers 🍔', bg: 'bg-amber-100 text-amber-800' },
    { name: 'Makis 🍣', bg: 'bg-red-100 text-red-800' },
    { name: 'Lomo Saltado 🇵🇪', bg: 'bg-orange-100 text-orange-950' },
    { name: 'Pizza 🍕', bg: 'bg-orange-100 text-orange-800' },
    { name: 'Pollo a la Brasa 🍗', bg: 'bg-yellow-100 text-yellow-800' },
    { name: 'Postres 🍰', bg: 'bg-pink-100 text-pink-800' },
    { name: 'Chifa 🥢', bg: 'bg-red-50 text-red-700' },
  ];

  return (
    <div className="bg-[#F8FAFC] font-sans antialiased text-slate-900 overflow-x-hidden">
      {/* Estilos dinámicos para el Marquee Infinito sin tocar archivos globales */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>

      <Navbar />

      {/* 🚀 HERO SECTION CON IDENTIDAD MANGO */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 bg-linear-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        {/* Glow de fondo adaptado a color mango */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.08),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Bloque Izquierdo */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] font-poppins">
              La comida que quieres,{' '}
              <span className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                en tiempo récord.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Pide a los restaurantes de tu zona y recíbelo en casa. Sigue tu pedido en tiempo real, desde el local hasta tu puerta.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl bg-slate-900 text-white font-bold text-base transition-all shadow-xl shadow-slate-900/10 hover:bg-amber-500 hover:shadow-amber-500/20 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Comenzar a pedir
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4.5 rounded-2xl text-slate-700 font-bold text-base bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:text-slate-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Explorar locales cercanos
              </Link>
            </div>

          </div>

          {/* Bloque Derecho: Mockup adaptado */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-100/20 rounded-full blur-3xl -z-10" />
            
            {/* Contenedor del Celular */}
            <div className="w-72 sm:w-80 h-140 bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 relative group transition-transform duration-500 hover:rotate-2">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-800 block absolute right-4" />
              </div>

              <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden p-4 flex flex-col justify-between relative select-none">
                <div className="pt-5 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tu Repartidor</p>
                    <p className="text-xs font-black text-slate-800">Carlos Mendoza</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    🏍️
                  </div>
                </div>

                {/* Mapa simulado con estética cálida */}
                <div className="flex-1 my-3 rounded-2xl bg-amber-50/40 border border-amber-100 p-3 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[24px_24px]" />
                  <div className="absolute top-1/3 left-1/4 right-1/4 h-1 bg-dashed border-t-2 border-amber-400 z-0" />

                  <div className="self-end bg-slate-900 text-white p-1.5 rounded-xl text-[10px] font-bold shadow-md z-10 flex items-center gap-1">
                    <MapPin size={10} className="text-amber-400 fill-amber-400" /> Mi Casa
                  </div>

                  <div className="self-start mt-10 ml-6 bg-white p-2 rounded-full shadow-lg border border-slate-100 z-10 animate-bounce">
                    <Bike size={16} className="text-amber-600" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700 bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">
                      ⚡ En camino
                    </span>
                    <span className="text-xs font-black text-slate-900">Llega en 12 min</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Orden: 2x Burger Suprema + Papas Gigantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎡 MARQUEE INFINITO DE ANTOJOS */}
      <div className="bg-white border-y border-slate-100 py-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10" />
        
        <div className="animate-marquee gap-4" aria-hidden="true">
          {[...cravings, ...cravings, ...cravings].map((craving, idx) => (
            <div
              key={idx}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xs border border-slate-100/50 cursor-pointer hover:scale-105 transition-transform ${craving.bg}`}
            >
              {craving.name}
            </div>
          ))}
        </div>
      </div>

      {/* 🍱 BENTO GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-3 font-poppins tracking-tight">¿Por qué QuickEats?</h2>
            <p className="text-slate-500 font-medium text-base">Comida de tus restaurantes favoritos: rápida, fácil y con seguimiento en vivo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
            {/* Caja Grande Bento 1: Color Mango en Textos */}
            <div className="md:col-span-2 md:row-span-2 bg-linear-to-br from-slate-900 to-slate-800 rounded-4xl p-8 text-white flex flex-col justify-between group relative overflow-hidden shadow-xl shadow-slate-900/10">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 group-hover:scale-110 transition-transform duration-500">
                <Clock size={300} />
              </div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Zap className="text-amber-400 fill-amber-400" size={22} />
              </div>
              <div>
                <span className="text-amber-400 font-black text-5xl tracking-tight sm:text-6xl block mb-2 font-poppins">
                  30 min
                </span>
                <h3 className="text-xl font-bold mb-2 font-poppins">Entrega rápida y seguimiento en vivo</h3>
                <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
                  Tu pedido se asigna al repartidor más cercano y puedes seguirlo en el mapa en tiempo real, desde el restaurante hasta tu puerta.
                </p>
              </div>
            </div>

            {/* Caja Bento 2 */}
            <div className="bg-amber-50/60 border border-amber-100 rounded-4xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow group">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-poppins tracking-tight">Restaurantes de tu zona</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">Trabajamos con locales reales, con sus menús y precios siempre actualizados.</p>
              </div>
            </div>

            {/* Caja Bento 3 */}
            <div className="bg-orange-50/60 border border-orange-100 rounded-4xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow group">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-1 font-poppins tracking-tight">Soporte cuando lo necesites</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">¿Algún problema con tu pedido? Escríbenos y te ayudamos a resolverlo rápido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛵 CÓMO FUNCIONA */}
      <section className="py-24 bg-slate-50/70 border-t border-slate-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-3 font-poppins tracking-tight">¿Cómo funciona?</h2>
            <p className="text-slate-500 font-medium text-base">Tres pasos entre tú y tu próxima comida favorita.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Search, step: '01', title: 'Explora', desc: 'Descubre los restaurantes cercanos a ti, filtrados por antojo, categoría y calificación.' },
              { icon: ShoppingBag, step: '02', title: 'Pide', desc: 'Agrega tus platillos favoritos al carrito y paga de forma segura en segundos.' },
              { icon: Bike, step: '03', title: 'Recibe', desc: 'Sigue a tu repartidor en tiempo real hasta que tu pedido llegue a tu puerta.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xs relative overflow-hidden group hover:shadow-lg transition-shadow">
                <span className="absolute -top-2 -right-2 text-7xl font-black text-slate-50 font-poppins select-none">{step}</span>
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-5 relative z-10 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2 font-poppins tracking-tight relative z-10">{title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed relative z-10">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🍽️ RESTAURANTES DESTACADOS */}
      <section className="py-24 bg-white border-t border-slate-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 font-poppins tracking-tight">Algunos de nuestros restaurantes</h2>
              <p className="text-slate-500 mt-1 font-medium text-sm">Crea tu cuenta gratis para ver los menús completos y hacer tu pedido.</p>
            </div>
            <div className="h-px bg-slate-200 flex-1 hidden sm:block mx-8 mb-3" />
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-lg"
            >
              Ver todos
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-4xl p-4 border border-slate-100 space-y-4 animate-pulse">
                  <div className="w-full h-48 bg-slate-200 rounded-2xl" />
                  <div className="h-5 bg-slate-200 rounded-md w-2/3" />
                  <div className="h-4 bg-slate-200 rounded-md w-full" />
                </div>
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="w-full py-20 px-4 bg-white rounded-4xl border border-slate-100 text-center flex flex-col items-center justify-center max-w-md mx-auto shadow-xs">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                <UtensilsCrossed size={24} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-poppins">No hay tiendas mapeadas</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium">Expandiendo cobertura en este instante.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((restaurant) => {
                const isExpress = restaurant.deliveryTime <= 30;
                const isCurrentlyOpen = restaurant.isOpen ?? true; 
                const hasValidImage = restaurant.image && (restaurant.image.startsWith('http') || restaurant.image.startsWith('/'));
                const imageSrc = hasValidImage ? restaurant.image : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80';

                return (
                  <Link
                    href="/register"
                    key={restaurant.id}
                    className={`bg-white rounded-4xl overflow-hidden border border-slate-100 flex flex-col justify-between group relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                      !isCurrentlyOpen ? 'opacity-65 saturate-50' : ''
                    }`}
                  >
                    <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={imageSrc}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80';
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

                      {!isCurrentlyOpen ? (
                        <span className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl shadow-xs flex items-center gap-1">
                          <Lock size={10} /> Cerrado
                        </span>
                      ) : isExpress && (
                        <span className="absolute top-4 left-4 bg-linear-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-xl shadow-xs flex items-center gap-1">
                          <Zap size={10} className="fill-white" /> Express
                        </span>
                      )}

                      <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-slate-800 font-extrabold text-[10px] uppercase tracking-wide px-3 py-1 rounded-xl shadow-xs">
                        {restaurant.category}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-extrabold text-xl text-slate-900 tracking-tight font-poppins line-clamp-1 group-hover:text-amber-500 transition-colors">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span>4.8</span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-5 font-medium">
                          {restaurant.description || 'Platillos de autor icónicos elaborados de forma local con insumos frescos de la estación.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Clock size={14} className="text-slate-400" />
                          <span>{restaurant.deliveryTime} mins</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-lg">
                          <Bike size={14} />
                          <span>
                            {(restaurant.deliveryFee ?? 0) === 0 
                              ? 'Envío Gratis' 
                              : `S/. ${Number(restaurant.deliveryFee).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 📣 CTA SECCIÓN SE ADAPTA AL COLOR MANGO */}
      <section className="py-24 text-white bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black font-poppins tracking-tighter">
            Menos fricción. Más sabor.<br />
            Haz tu primer pedido hoy.
          </h2>
          <p className="text-base text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
            Regístrate en menos de 30 segundos, accede a cupones exclusivos de bienvenida y experimenta el verdadero delivery en alta velocidad.
          </p>
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4.5 bg-amber-500 rounded-2xl font-bold text-base text-white transition-all shadow-xl shadow-amber-500/20 hover:bg-amber-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Crear Cuenta Sin Costo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-600 py-12 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium">
          <p>© 2026 QuickEats. Tu delivery favorito en Lima.</p>
          <p className="text-xs text-slate-700">Lima, Perú.</p>
        </div>
      </footer>
    </div>
  );
}