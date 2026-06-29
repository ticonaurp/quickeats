'use client';

// 1. 🟢 Importamos React para poder desenvolver la promesa de params
import React, { useState, useEffect } from 'react';
import TopNavbar from '../../components/TopNavbar';
import RestaurantHero from './components/RestaurantHero';
import RestaurantInfoCard from './components/RestaurantInfoCard';
import MenuSection from './components/MenuSection';
import CartSidebar from './components/CartSidebar';
import { toast } from 'sonner';

// 2. Importamos ambas funciones reales desde tu archivo de servicios
import { getProducts, getRestaurantById } from '../../services/product.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface RestaurantPageProps {
  // 🟢 CORRECCIÓN NEXT.JS 15: En las nuevas versiones, params es explícitamente una Promesa
  params: Promise<{
    id: string;
  }>;
}

export default function RestaurantDetailPage({ params }: RestaurantPageProps) {
  // 🟢 SOLUCIÓN AL ERROR: Desendulzamos los parámetros asíncronos usando React.use()
  const resolvedParams = React.use(params);
  const restaurantId = resolvedParams.id;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  
  // 🟢 CERO HARDCODEO: El estado del restaurante ahora arranca limpio desde la base de datos
  const [restaurantInfo, setRestaurantInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 🛡️ CONTROL DE QA: Estado bandera para saber cuándo terminó de leer el LocalStorage
  const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false);

  // 4. EFECTO: Carga en paralelo los productos y los datos de la tienda usando el ID dinámico
  useEffect(() => {
    const fetchAllRestaurantData = async () => {
      try {
        setLoading(true);
        
        // Disparamos ambas consultas a tu API Gateway (Puerto 3001) al mismo tiempo
        const [productsData, restaurantData] = await Promise.all([
          getProducts(restaurantId),
          getRestaurantById(restaurantId)
        ]);
        
        // Mapeamos los platos provenientes de Prisma ORM
        const mappedProducts = productsData.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || 'Sin descripción disponible.',
          price: Number(item.price), 
          calories: item.calories ? `${item.calories} cal` : '350 cal',
          image: item.image || 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300',
          isPopular: item.isPopular ?? false
        }));

        // 🟢 Mapeamos los campos reales de tu tabla 'Restaurant' de PostgreSQL
        setRestaurantInfo({
          id: restaurantData.id,
          name: restaurantData.name,
          cuisine: restaurantData.category || 'General', // Se conecta con tu campo 'category'
          description: restaurantData.description || 'Sin descripción disponible por el momento.',
          deliveryFee: Number(restaurantData.deliveryFee) || 0.00,
          deliveryTime: Number(restaurantData.deliveryTime || restaurantData.deliveryMin || restaurantData.estimatedTime || 25),
          coverImage: restaurantData.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200'
        });

        setMenuItems(mappedProducts);
      } catch (error: any) {
        toast.error(error.message || 'No se pudieron sincronizar los datos de la tienda 😢');
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchAllRestaurantData();
    }
  }, [restaurantId]); // Reacciona de forma reactiva si el ID cambia en la URL

  // 📥 NUEVO EFECTO DE HIDRATACIÓN: Lee el carrito guardado apenas entras a la página
  useEffect(() => {
    const savedCart = localStorage.getItem('quickeats_cart');
    const savedRestaurant = localStorage.getItem('quickeats_restaurant');

    if (savedCart && savedRestaurant) {
      const parsedRest = JSON.parse(savedRestaurant);
      // Solo restauramos el carrito si pertenece a este restaurante específico
      if (parsedRest.id === restaurantId) {
        setCart(JSON.parse(savedCart));
      }
    }
    setIsCartLoaded(true); // Bloqueo desactivado: Ya sabemos qué había en el navegador
  }, [restaurantId]);

  // 5. EFECTO DE PERSISTENCIA: Sincroniza los cambios hacia el LocalStorage
  useEffect(() => {
    // 🛡️ Guardaguarda de seguridad: No sobreescribir nada hasta que el efecto de lectura haya terminado
    if (!isCartLoaded) return;

    if (cart.length > 0 && restaurantInfo) {
      const formattedCartForCheckout = cart.map(item => {
        const originalItem = menuItems.find(p => p.id === item.id);

        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          calories: originalItem?.calories || '350 cal',
          image: originalItem?.image || 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300'
        };
      });

      localStorage.setItem('quickeats_cart', JSON.stringify(formattedCartForCheckout));
      localStorage.setItem('quickeats_restaurant', JSON.stringify(restaurantInfo));
    } else if (cart.length === 0 && isCartLoaded) {
      // Si el usuario remueve todos los elementos desde el sidebar, limpiamos el almacenamiento
      localStorage.removeItem('quickeats_cart');
      localStorage.removeItem('quickeats_restaurant');
    }
  }, [cart, restaurantInfo, menuItems, isCartLoaded]);

  // Lógica de manipulación de cantidades en el carrito
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
        return prevCart.filter((item) => item.id !== id);
      }
    });
  };

  // Bloque de carga defensivo mientras responde la base de datos relacional
  if (loading || !restaurantInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-500 font-bold text-sm tracking-tight">Sincronizando comercio con PostgreSQL...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased">
      <TopNavbar />

      <RestaurantHero 
        name={restaurantInfo.name} 
        cuisine={restaurantInfo.cuisine} 
        coverImage={restaurantInfo.coverImage} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <RestaurantInfoCard 
          description={restaurantInfo.description} 
          deliveryFee={restaurantInfo.deliveryFee} />

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-8 pb-16">
          {/* Listado de Platos filtrados en tiempo real */}
          <div className="lg:col-span-7">
            <MenuSection 
              items={menuItems} 
              cart={cart} 
              onUpdateQuantity={handleUpdateQuantity} />
          </div>

          {/* Barra Lateral Interactiva */}
          <div className="lg:col-span-3">
            <CartSidebar 
              cart={cart} 
              deliveryFee={restaurantInfo.deliveryFee} 
              onUpdateQuantity={handleUpdateQuantity} />
          </div>
        </div>
      </div>
    </div>
  );
}