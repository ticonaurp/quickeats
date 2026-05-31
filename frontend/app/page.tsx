import Link from 'next/link';
import { ArrowRight, Star, Clock, Bike, Shield, Smartphone, ChevronRight } from 'lucide-react';
import { Navbar } from '../app/components/Navbar';

export default function Home() {
  // Estado vacío por defecto hasta que conectemos con el backend
  const featured: any[] = [];

  return (
    <div className="bg-white font-sans">
      {/* Barra de Navegación */}
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Entregando ahora en todo Lima
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-5 font-poppins">
              La comida que amas,<br />
              <span className="text-green-500">entregada rápido.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pide de los mejores restaurantes locales. Rastrea tu pedido en tiempo real. En la puerta de tu casa en 30 minutos o menos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-green-500 text-white font-semibold text-lg transition-all hover:opacity-90 hover:scale-[1.02]"
              >
                Pedir Ahora
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-gray-700 font-semibold text-lg bg-white border border-gray-200 hover:border-green-300 hover:text-green-600 transition-all"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>

          {/* Hero image area - Limpio sin tarjetas flotantes */}
          <div className="relative hidden md:block">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"
                alt="Comida deliciosa"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3 font-poppins">¿Por qué QuickEats?</h2>
            <p className="text-gray-500 text-lg">La plataforma de delivery más rápida y confiable.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Ultra Rápido', desc: 'Tiempo promedio de entrega menor a 30 minutos. Nos asociamos solo con restaurantes cercanos.', color: 'bg-orange-100', iconColor: 'text-orange-600' },
              { icon: Shield, title: 'Seguro y Confiable', desc: 'Tus datos y pagos están totalmente encriptados. Solo trabajamos con locales verificados.', color: 'bg-blue-100', iconColor: 'text-blue-600' },
              { icon: Bike, title: 'Rastreo en Vivo', desc: 'Sigue tu orden en tiempo real. Entérate exactamente cuándo llegará tu comida.', color: 'bg-green-100', iconColor: 'text-green-600' },
            ].map(({ icon: Icon, title, desc, color, iconColor }) => (
              <div key={title} className="text-center p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon size={28} className={iconColor} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 font-poppins">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants (Empty State Activo) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 font-poppins">Restaurantes Destacados</h2>
              <p className="text-gray-500 mt-1">Nuestros favoritos elegidos por miles de usuarios</p>
            </div>
          </div>
          
          <div className="w-full py-16 px-4 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">Aún no hay restaurantes</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Estamos trabajando duro para traer los mejores locales a tu zona. ¡Vuelve muy pronto!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white bg-gradient-to-br from-green-600 to-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Smartphone size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4 font-poppins">¿Listo para pedir?</h2>
          <p className="text-xl text-green-100 mb-8">Únete a más de 10,000 clientes felices disfrutando de un delivery rápido y confiable.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-2xl font-bold text-lg text-green-500 transition-all hover:scale-105"
          >
            Crear Cuenta Gratis
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl bg-green-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="font-bold text-white font-poppins">QuickEats</span>
          </div>
          <p className="text-sm">© 2026 QuickEats. Hecho con ❤️ para los amantes de la comida.</p>
        </div>
      </footer>
    </div>
  );
}