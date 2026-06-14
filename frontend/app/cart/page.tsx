'use client';

import { useState } from 'react';
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

export default function CartPage() {
  // Estado reactivo del carrito
  const [cart, setCart] = useState<CheckoutCartItem[]>([
    {
      id: 'm1',
      name: 'Al Pastor Tacos (3)',
      price: 26.00,
      quantity: 1,
      calories: '480 cal',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80',
    }
  ]);

  const restaurantInfo = {
    id: '1', 
    name: 'Taco Loco',
    deliveryFee: 4.50,
  };

  // Manejo de cantidades
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

  // Remover un item individual
  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Vaciar el carrito entero
  const handleClearCart = () => {
    setCart([]);
  };

  // Cálculos dinámicos globales
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal > 0 ? subtotal + restaurantInfo.deliveryFee : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased pb-16">
      <TopNavbar />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
          
          {/* COLUMNA IZQUIERDA: CABECERA Y PRODUCTOS (6/10 del canvas) */}
          <div className="md:col-span-6 space-y-7">
            <CartHeader 
              restaurantId={restaurantInfo.id} 
              restaurantName={restaurantInfo.name} 
            />
            
            <CartItemsList 
              cart={cart}
              restaurantId={restaurantInfo.id}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </div>

          {/* COLUMNA DERECHA: RESUMEN Y TIEMPO ESTIMADO (4/10 del canvas) */}
          <div className="md:col-span-4 sticky top-6 self-start space-y-4">
            <CartSummary 
              subtotal={subtotal}
              deliveryFee={restaurantInfo.deliveryFee}
              total={total}
              onClearCart={handleClearCart}
            />

            {subtotal > 0 && (
              <DeliveryEstimation restaurantName={restaurantInfo.name} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}