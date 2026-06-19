'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// 🟢 Importamos el TopNavbar respetando tu árbol de archivos
import TopNavbar from '../components/TopNavbar';

// 🧱 Importación de los componentes de la vista del checkout
import StepIndicator from '../components/checkout/StepIndicator';
import AddressSection from '../components/checkout/AddressSection';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummarySidebar from '../components/checkout/OrderSummarySidebar';

// 🔐 Importamos el lector dinámico de sesión real
import { getUserId } from '../services/auth';

export default function PagoPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  
  const [address, setAddress] = useState({ street: 'Av. Principal 123', notes: '' });
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // Cargamos los datos del carrito guardados en el navegador al montar la vista
  useEffect(() => {
    const savedCart = localStorage.getItem('quickeats_cart');
    const savedRestaurant = localStorage.getItem('quickeats_restaurant');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedRestaurant) setRestaurant(JSON.parse(savedRestaurant));
  }, []);

  // 🚀 NORMALIZACIÓN DE QA: Asegura compatibilidad si el producto viene anidado o plano
  const normalizedCart = cart.map((item) => {
    const target = item.product || item; // Si existe item.product usa ese, si no, usa el elemento raíz
    return {
      id: item.id || target.id || target.productId,
      productId: target.productId || target.id || item.productId || item.id,
      name: target.name || 'Producto',
      price: Number(target.price || 0),
      quantity: Number(item.quantity || 1),
    };
  });

  // 📊 Cálculos dinámicos globales basados en el carrito normalizado
  const cartTotal = normalizedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const total = cartTotal + deliveryFee;

  const handleAddressSubmit = () => {
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card' && !cardData.number) {
      toast.error('Por favor, ingresa los datos de tu tarjeta'); 
      return;
    }
    
    setLoading(true);

    try {
      // 👤 SOLUCIÓN: Obtenemos el ID de sesión dinámico real del usuario logueado
      const userId = getUserId();
      
      if (!userId) {
        toast.error('Tu sesión expiró o es inválida. Por favor inicia sesión de nuevo.');
        router.push('/login');
        return;
      }

      // 🌐 URL DINÁMICA DEL GATEWAY
      const gatewayUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // 📦 MAPEO ESTRICTO PARA TU CREATE-ORDER DTO
      const orderPayload = {
        userId, // 🌟 ID sincronizado con Supabase Auth e Historial
        restaurantId: restaurant?.id ?? '',
        restaurantName: restaurant?.name ?? 'Restaurante',
        address: address.street,
        deliveryNotes: address.notes || undefined, 
        paymentMethod: paymentMethod === 'card' ? 'CARD' : 'CASH', 
        subtotal: cartTotal,
        deliveryFee,
        total,
        items: normalizedCart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      // 🚀 DISPARO DE PETICIÓN AL API GATEWAY
      const response = await fetch(`${gatewayUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Hubo un problema al procesar tu pedido.');
      }

      console.log('Orden procesada y guardada con éxito:', data);
      toast.success('¡Pedido realizado con éxito! 🎉');
      
      localStorage.removeItem('quickeats_cart');
      router.push('/orders'); 

    } catch (error: any) {
      console.error('Error al generar la orden:', error);
      toast.error(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      // ✨ Corregido: Removido el fragmento de texto roto que causaba los errores 2304 y 1136
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased pb-16">
      <TopNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => step === 'payment' ? setStep('address') : router.push('/cart')} 
            className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="font-extrabold text-slate-900 tracking-tight text-3xl">
              Pago
            </h1>
          </div>
        </div>

        <StepIndicator step={step} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === 'address' ? (
              <AddressSection 
                address={address} 
                setAddress={setAddress} 
                onContinue={handleAddressSubmit} 
              />
            ) : (
              <PaymentSection 
                paymentMethod={paymentMethod} 
                setPaymentMethod={setPaymentMethod} 
                cardData={cardData} 
                setCardData={setCardData} 
                handlePlaceOrder={handlePlaceOrder} 
                loading={loading} 
                total={total}
              />
            )}
          </div>

          {/* Resumen de la Orden Lateral */}
          <div>
            <OrderSummarySidebar 
              restaurant={restaurant} 
              cart={normalizedCart} 
              cartTotal={cartTotal} 
              deliveryFee={deliveryFee} 
              total={total} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}