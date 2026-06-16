'use client';

import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  step: 'address' | 'payment';
}

export default function StepIndicator({ step }: StepIndicatorProps) {
  const STEPS = ['address', 'payment'];

  return (
    <div className="flex items-center gap-3 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              step === s 
                ? 'bg-[#22C55E] text-white' 
                : STEPS.indexOf(step) > i 
                ? 'bg-gray-100 text-gray-500' 
                : 'bg-gray-100 text-gray-400'
            }`} 
            style={{ fontWeight: 600, fontSize: '0.8rem' }}
          >
            {STEPS.indexOf(step) > i ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
            {s === 'address' ? 'Dirección de Entrega' : 'Pago'}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 ${STEPS.indexOf(step) > i ? 'bg-[#22C55E]' : 'bg-gray-200'}`} style={{ minWidth: '2rem' }} />
          )}
        </div>
      ))}
    </div>
  );
}