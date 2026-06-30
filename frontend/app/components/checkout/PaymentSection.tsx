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

// --- Utilidades de formato y validación de tarjeta ---
const onlyDigits = (s: string) => s.replace(/\D/g, '');

function formatCardNumber(v: string): string {
  return onlyDigits(v).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string): string {
  const d = onlyDigits(v).slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
}

// Algoritmo de Luhn: valida que el número de tarjeta sea matemáticamente correcto.
function luhnValid(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// Vencimiento MM/AA válido y no expirado.
function isExpiryValid(exp: string): boolean {
  const m = exp.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const firstOfNextMonth = new Date(year, month, 1);
  return firstOfNextMonth > new Date();
}

export default function PaymentSection({
  paymentMethod, setPaymentMethod, cardData, setCardData, handlePlaceOrder, loading, total
}: PaymentSectionProps) {
  // Validaciones por campo
  const digits = onlyDigits(cardData.number);
  const nameOk = cardData.name.trim().length >= 3;
  const numberOk = digits.length === 16 && luhnValid(digits);
  const expiryOk = isExpiryValid(cardData.expiry);
  const cvcOk = /^\d{3,4}$/.test(cardData.cvc);
  const cardValid = nameOk && numberOk && expiryOk && cvcOk;

  // Mostramos el error solo si el campo tiene contenido y es inválido
  const err = {
    name: cardData.name.length > 0 && !nameOk,
    number: cardData.number.length > 0 && !numberOk,
    expiry: cardData.expiry.length > 0 && !expiryOk,
    cvc: cardData.cvc.length > 0 && !cvcOk,
  };

  const inputBase =
    'w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 text-gray-900 transition-colors';
  const borderOk = 'border-gray-200 focus:border-[#F97316]';
  const borderErr = 'border-red-300 focus:border-red-400';

  const disabled = loading || (paymentMethod === 'card' && !cardValid);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
          <CreditCard size={18} className="text-[#F97316]" />
        </div>
        <h2 style={{ fontWeight: 700, color: '#0F172A' }}>Método de Pago</h2>
      </div>

      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => setPaymentMethod(m.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === m.id ? 'border-[#F97316] bg-[#F97316]/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={paymentMethod === m.id ? 'text-[#F97316]' : 'text-gray-400'}>{m.icon}</div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: paymentMethod === m.id ? '#0F172A' : '#64748B' }}>
              {m.label}
            </span>
            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === m.id ? 'border-[#F97316]' : 'border-gray-300'
            }`}>
              {paymentMethod === m.id && <div className="w-2.5 h-2.5 bg-[#F97316] rounded-full" />}
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
              onChange={e => setCardData(c => ({ ...c, name: e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '') }))}
              placeholder="Nombre completo impreso"
              className={`${inputBase} ${err.name ? borderErr : borderOk}`}
              style={{ fontSize: '0.9rem' }}
            />
            {err.name && <p className="text-[11px] text-red-500 mt-1 font-medium">Ingresa el nombre tal como aparece en la tarjeta.</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Número de tarjeta
            </label>
            <input
              value={cardData.number}
              onChange={e => setCardData(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              className={`${inputBase} ${err.number ? borderErr : borderOk}`}
              style={{ fontSize: '0.9rem' }}
              maxLength={19}
            />
            {err.number && <p className="text-[11px] text-red-500 mt-1 font-medium">Número de tarjeta inválido (16 dígitos).</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Vencimiento
              </label>
              <input
                value={cardData.expiry}
                onChange={e => setCardData(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                placeholder="MM/AA"
                inputMode="numeric"
                className={`${inputBase} ${err.expiry ? borderErr : borderOk}`}
                style={{ fontSize: '0.9rem' }}
                maxLength={5}
              />
              {err.expiry && <p className="text-[11px] text-red-500 mt-1 font-medium">Fecha inválida o vencida.</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                CVC
              </label>
              <input
                value={cardData.cvc}
                onChange={e => setCardData(c => ({ ...c, cvc: onlyDigits(e.target.value).slice(0, 4) }))}
                placeholder="123"
                inputMode="numeric"
                className={`${inputBase} ${err.cvc ? borderErr : borderOk}`}
                style={{ fontSize: '0.9rem' }}
                maxLength={4}
              />
              {err.cvc && <p className="text-[11px] text-red-500 mt-1 font-medium">3 o 4 dígitos.</p>}
            </div>
          </div>
        </motion.div>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={disabled}
        className="mt-6 w-full py-4 bg-[#F97316] text-white rounded-2xl hover:bg-[#EA580C] transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ fontWeight: 700 }}
      >
        {loading ? (
          <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando pago...</>
        ) : (
          `Realizar Pedido · S/. ${total.toFixed(2)}`
        )}
      </button>

      {paymentMethod === 'card' && !cardValid && (
        <p className="text-[11px] text-gray-400 text-center mt-2 font-medium">
          Completa los datos de la tarjeta para habilitar el pago.
        </p>
      )}
    </motion.div>
  );
}
