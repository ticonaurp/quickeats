'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import TopNavbar from '../components/TopNavbar';
import StepIndicator from '../components/checkout/StepIndicator';
import AddressSection from '../components/checkout/AddressSection';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummarySidebar from '../components/checkout/OrderSummarySidebar';

// 🛡️ Importamos getUserId junto a la validación de sesión
import { isTokenValid, getUserId } from '../services/auth';

export default function PagoPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [address, setAddress] = useState({ street: 'Av. Principal 123', notes: '' });
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // 🛡️ PROTECCIÓN DE RUTA ULTRA ESTRICTA
  useEffect(() => {
    if (!isTokenValid()) {
      toast.error('Tu sesión expiró o es inválida. Por favor inicia sesión.');
      router.replace('/login?redirect=/cart');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Cargamos los datos del carrito guardados en el navegador
  useEffect(() => {
    const savedCart = localStorage.getItem('quickeats_cart');
    const savedRestaurant = localStorage.getItem('quickeats_restaurant');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedRestaurant) setRestaurant(JSON.parse(savedRestaurant));
  }, []);

  const normalizedCart = cart.map((item) => {
    const target = item.product || item;
    return {
      id: item.id || target.id || target.productId,
      productId: target.productId || target.id || item.productId || item.id,
      name: target.name || 'Producto',
      price: Number(target.price || 0),
      quantity: Number(item.quantity || 1),
    };
  });

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
      if (!isTokenValid()) {
        toast.error('Sesión inválida.');
        router.push('/login?redirect=/cart');
        return;
      }

      // 👤 Extraemos el ID único del usuario autenticado de forma dinámica
      const userId = getUserId();
      if (!userId) {
        toast.error('No se pudo determinar el ID de usuario. Reincia sesión.');
        router.push('/login?redirect=/cart');
        return;
      }

      const gatewayUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      // 📦 Agregamos el campo 'userId' requerido obligatoriamente por el CreateOrderDto
      const orderPayload = {
        userId, // 👈 🟢 CORREGIDO: Inyección del identificador del usuario
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

      toast.success('¡Pedido realizado con éxito! 🎉');
      localStorage.removeItem('quickeats_cart');
      router.push('/orders'); 

    } catch (error: any) {
      console.error('Error al generar la orden:', error);
      toast.error(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-bold text-sm uppercase tracking-wider">
          Verificando seguridad...
        </div>
      </div>
    );
  }

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
            <h1 className="font-extrabold text-slate-900 tracking-tight text-3xl">Pago</h1>
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