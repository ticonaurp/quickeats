'use client';

import { CreditCard, Banknote } from 'lucide-react';
import { motion } from 'motion/react';

interface CardData {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: (id: string) => void;
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  handlePlaceOrder: () => Promise<void>;
  loading: boolean;
  total: number;
}

const PAYMENT_METHODS = [
  { id: 'card', icon: <CreditCard size={18} />, label: 'Tarjeta de Crédito / Débito' },
  { id: 'cash', icon: <Banknote size={18} />, label: 'Efectivo contra entrega' },
];

export default function PaymentSection({
  paymentMethod, setPaymentMethod, cardData, setCardData, handlePlaceOrder, loading, total
}: PaymentSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#22C55E]/10 rounded-xl flex items-center justify-center">
          <CreditCard size={18} className="text-[#22C55E]" />
        </div>
        <h2 style={{ fontWeight: 700, color: '#0F172A' }}>Método de Pago</h2>
      </div>

      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map(m => (
          <button 
            key={m.id} 
            onClick={() => setPaymentMethod(m.id)} 
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === m.id ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={paymentMethod === m.id ? 'text-[#22C55E]' : 'text-gray-400'}>{m.icon}</div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: paymentMethod === m.id ? '#0F172A' : '#64748B' }}>
              {m.label}
            </span>
            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === m.id ? 'border-[#22C55E]' : 'border-gray-300'
            }`}>
              {paymentMethod === m.id && <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full" />}
            </div>
          </button>
        ))}
      </div>

      {paymentMethod === 'card' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="space-y-4 border-t border-gray-100 pt-5"
        >
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Nombre del titular
            </label>
            <input 
              value={cardData.name} 
              onChange={e => setCardData(c => ({ ...c, name: e.target.value }))} 
              placeholder="Nombre completo impreso"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 text-gray-900" 
              style={{ fontSize: '0.9rem' }} 
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Número de tarjeta
            </label>
            <input 
              value={cardData.number} 
              onChange={e => setCardData(c => ({ ...c, number: e.target.value }))} 
              placeholder="4242 4242 4242 4242"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 text-gray-900" 
              style={{ fontSize: '0.9rem' }} 
              maxLength={19} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Vencimiento
              </label>
              <input 
                value={cardData.expiry} 
                onChange={e => setCardData(c => ({ ...c, expiry: e.target.value }))} 
                placeholder="MM/AA"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 text-gray-900" 
                style={{ fontSize: '0.9rem' }} 
                maxLength={5} 
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                CVC
              </label>
              <input 
                value={cardData.cvc} 
                onChange={e => setCardData(c => ({ ...c, cvc: e.target.value }))} 
                placeholder="123"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 text-gray-900" 
                style={{ fontSize: '0.9rem' }} 
                maxLength={4} 
              />
            </div>
          </div>
        </motion.div>
      )}

      <button 
        onClick={handlePlaceOrder} 
        disabled={loading} 
        className="mt-6 w-full py-4 bg-[#22C55E] text-white rounded-2xl hover:bg-[#16A34A] transition-all shadow-lg shadow-green-200 disabled:opacity-70 flex items-center justify-center gap-2" 
        style={{ fontWeight: 700 }}
      >
        {loading ? (
          <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando pago...</>
        ) : (
          `Realizar Pedido · S/. ${total.toFixed(2)}`
        )}
      </button>
    </motion.div>
  );
}