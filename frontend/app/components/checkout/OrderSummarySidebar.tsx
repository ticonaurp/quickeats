'use client';

interface OrderSummarySidebarProps {
  restaurant: any;
  cart: any[];
  cartTotal: number;
  deliveryFee: number;
  total: number;
}

export default function OrderSummarySidebar({ 
  restaurant, cart, cartTotal, deliveryFee, total 
}: OrderSummarySidebarProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
      <h3 style={{ fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Resumen del Pedido</h3>
      
      {restaurant && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {restaurant.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>{restaurant.name}</p>
            <p className="text-gray-400" style={{ fontSize: '0.75rem' }}>{cart.length} productos</p>
          </div>
        </div>
      )}

      <div className="space-y-2 border-t border-gray-100 pt-4">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-gray-600" style={{ fontSize: '0.8rem' }}>
            {/* 🟢 Cambiado a item.name e item.price directos */}
            <span>{item.quantity}× {item.name}</span>
            <span>S/. {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
        <div className="flex justify-between text-gray-500" style={{ fontSize: '0.8rem' }}>
          <span>Subtotal</span><span>S/. {cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500" style={{ fontSize: '0.8rem' }}>
          <span>Envío</span><span>{deliveryFee === 0 ? 'Gratis' : `S/. ${deliveryFee.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between pt-1" style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
          <span>Total</span><span>S/. {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}