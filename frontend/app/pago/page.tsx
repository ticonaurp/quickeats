'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Order } from '../data/mockData';

// 🟢 Importamos el TopNavbar respetando tu árbol de archivos
import TopNavbar from '../components/TopNavbar';

// 🧱 Importación de los componentes de la vista del checkout
import StepIndicator from '../components/checkout/StepIndicator';
import AddressSection from '../components/checkout/AddressSection';
import PaymentSection from '../components/checkout/PaymentSection';
import OrderSummarySidebar from '../components/checkout/OrderSummarySidebar';

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

  // Cálculos dinámicos globales para los soles (S/.)
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
    await new Promise(r => setTimeout(r, 1800));

    const order: Order = {
      id: `ORD-${Date.now()}`,
      restaurantName: restaurant?.name ?? 'Restaurante',
      restaurantId: restaurant?.id ?? '',
      items: cart,
      subtotal: cartTotal,
      deliveryFee,
      total,
      status: 'confirmed',
      createdAt: new Date(),
      estimatedDelivery: '30-45 min',
      address: address.street,
    };

    console.log('Orden procesada con éxito:', order);
    setLoading(false);
    toast.success('¡Pedido realizado con éxito! 🎉');
    
    // Limpiamos el carrito local tras finalizar la compra exitosamente
    localStorage.removeItem('quickeats_cart');
    router.push('/orders'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased pb-16">
      {/* 🟢 NAVBAR INTEGRADO EN LA PARTE SUPERIOR */}
      <TopNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        
        {/* Botón de retroceso y Título */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => step === 'payment' ? setStep('address') : router.push('/cart')} 
            className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 style={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em', fontSize: '1.75rem' }}>
              Pago
            </h1>
          </div>
        </div>

        {/* Indicador de Línea de progreso */}
        <StepIndicator step={step} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formularios dinámicos controlados por el botón */}
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

          {/* Resumen de la Orden Lateral en S/. */}
          <div>
            <OrderSummarySidebar 
              restaurant={restaurant} 
              cart={cart} 
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