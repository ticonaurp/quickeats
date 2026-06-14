'use client';

import { useState } from 'react';
import TopNavbar from '../../components/TopNavbar';
import RestaurantHero from './components/RestaurantHero';
import RestaurantInfoCard from './components/RestaurantInfoCard';
import MenuSection from './components/MenuSection';
import CartSidebar from './components/CartSidebar';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function RestaurantDetailPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const restaurantInfo = {
    name: 'Taco Loco',
    cuisine: 'Mexican • Street Food',
    description: 'Auténticos tacos mexicanos con tortillas artesanales, carnes marinadas al pastor y salsas de la casa.',
    deliveryFee: 4.50,
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80'
  };

  const menuItems = [
    {
      id: 'm1',
      name: 'Al Pastor Tacos (3)',
      description: 'Cerdo marinado, piña, cilantro, cebolla, salsa verde y tortilla de maíz artesanal.',
      price: 26.00,
      calories: '480 cal',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80',
      isPopular: true
    },
    {
      id: 'm2',
      name: 'Birria Quesatacos (2)',
      description: 'Carne de res desmechada cocida a fuego lento, queso derretido, acompañado de consomé para sumergir.',
      price: 32.00,
      calories: '620 cal',
      image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=300&q=80',
      isPopular: false
    },
    {
      id: 'm3',
      name: 'Guacamole & Chips',
      description: 'Guacamole fresco hecho al momento con palta, lima, jalapeño y totopos crujientes de la casa.',
      price: 18.00,
      calories: '310 cal',
      image: 'https://images.unsplash.com/photo-1570462210517-ce606629dcb2?auto=format&fit=crop&w=300&q=80',
      isPopular: false
    }
  ];

  // Lógica interactiva para manejar las cantidades
  const handleUpdateQuantity = (id: string, name: string, price: number, action: 'increase' | 'decrease') => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);

      if (action === 'increase') {
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { id, name, price, quantity: 1 }];
      } else {
        if (existingItem && existingItem.quantity > 1) {
          return prevCart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          );
        }
        return prevCart.filter((item) => item.id === id);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <TopNavbar />

      <RestaurantHero 
        name={restaurantInfo.name} 
        cuisine={restaurantInfo.cuisine} 
        coverImage={restaurantInfo.coverImage} 
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <RestaurantInfoCard 
          description={restaurantInfo.description} 
          deliveryFee={restaurantInfo.deliveryFee} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-8 pb-16">
          {/* Listado de Platos */}
          <div className="lg:col-span-7">
            <MenuSection 
              items={menuItems} 
              cart={cart} 
              onUpdateQuantity={handleUpdateQuantity} 
            />
          </div>

          {/* Barra Lateral Interactiva */}
          <div className="lg:col-span-3">
            <CartSidebar 
              cart={cart} 
              deliveryFee={restaurantInfo.deliveryFee} 
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}