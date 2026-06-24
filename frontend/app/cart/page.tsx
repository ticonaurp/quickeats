'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🟢 Inicialización del router
import { isTokenValid } from '../services/auth'; // 🟢 Importación de la utilidad de sesión
import TopNavbar from '../components/TopNavbar';
import CartHeader from './components/CartHeader';
import CartItemsList from './components/CartItemsList';
import CartSummary from './components/CartSummary';
import DeliveryEstimation from './components/DeliveryEstimation';

export interface CheckoutCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  calories: string;
  image: string;
}

interface RestaurantInfo {
  id: string;
  name: string;
  deliveryFee: number;
  deliveryTime?: number;
}

export default function CartPage() {
  const router = useRouter(); // 🟢 Instanciamos el router
  const [cart, setCart] = useState<CheckoutCartItem[]>([]);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 📋 1. EFECTO DE CARGA: Recupera la información real del LocalStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem('quickeats_cart');
    const savedRestaurant = localStorage.getItem('quickeats_restaurant');

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedRestaurant) {
      setRestaurantInfo(JSON.parse(savedRestaurant));
    }
    setIsLoaded(true);
  }, []);

  // 🔄 2. EFECTO DE SINCRONIZACIÓN: 🟢 CORREGIDO PARA EVITAR EL BUG 404
  useEffect(() => {
    if (!isLoaded) return;

    if (cart.length === 0) {
      // Solo removemos los productos del carrito. NO eliminamos el restaurante
      // para que el botón de regresar siga teniendo el ID dinámico a dónde ir.
      localStorage.removeItem('quickeats_cart');
    } else {
      localStorage.setItem('quickeats_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Manejador dinámico para actualizar cantidades
  const handleUpdateQuantity = (id: string, action: 'increase' | 'decrease') => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          if (action === 'increase') return { ...item, quantity: item.quantity + 1 };
          if (action === 'decrease' && item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  // Eliminar un producto específico
  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Vaciar el carrito completo
  const handleClearCart = () => {
    setCart([]);
  };

  // 🟢 Manejo del flujo inteligente de autenticación para el Checkout
  const handleProceedToPayment = () => {
    if (isTokenValid()) {
      router.push('/pago');
    } else {
      // Si no es válido, guardamos la intención de compra redirigiendo con el query param
      router.push('/login?redirect=/cart');
    }
  };

  // Cálculos matemáticos
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = restaurantInfo?.deliveryFee ?? 0;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-gray-400 font-medium">Cargando tu carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased pb-16">
      <TopNavbar />

      {/* 🛠️ CORREGIDO: Se reemplazó max-w-[1440px] por max-w-360 según sugerencia de Tailwind */}
      <div className="max-w-360 mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
          
          {/* Lado Izquierdo: Lista de ítems */}
          <div className="md:col-span-6 space-y-7">
            {/* 🛡️ SALVAVIDAS: Si no hay ID por alguna razón extraña, lo mandamos al Home ("/") en lugar de un 404 */}
            <CartHeader 
              restaurantId={restaurantInfo?.id || '/'} 
              restaurantName={restaurantInfo?.name || 'tu tienda'} 
            />
            
            <CartItemsList 
              cart={cart}
              restaurantId={restaurantInfo?.id || '/'}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </div>

          {/* Lado Derecho: Resumen financiero */}
          <div className="md:col-span-4 sticky top-6 self-start space-y-4">
            {/* 🟢 CORREGIDO: Inyectamos la prop onProceed que requería TypeScript */}
            <CartSummary 
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              onClearCart={handleClearCart}
              onProceed={handleProceedToPayment}
            />

            {subtotal > 0 && restaurantInfo && (
              <DeliveryEstimation 
                restaurantName={restaurantInfo.name} 
                deliveryTime={restaurantInfo.deliveryTime || 20} 
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}