export default function HowItWorksBanner() {
  return (
    <div className="mb-12 bg-slate-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-amber-500 text-[0.75rem] font-bold tracking-widest uppercase mb-1">¿Cómo funciona?</p>
        <h3 className="text-white font-extrabold text-[1.2rem] mb-6">Pide en 3 pasos</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', emoji: '🍽️', title: 'Elige tu restaurante', desc: 'Explora el catálogo y selecciona lo que más te apetezca.' },
            { step: '02', emoji: '🛒', title: 'Agrega al carrito', desc: 'Selecciona tus platos favoritos y personaliza tu pedido.' },
            { step: '03', emoji: '🚀', title: 'Recibe en minutos', desc: 'Paga online y sigue el estado de tu entrega en tiempo real.' }
          ].map(s => (
            <div key={s.step} className="flex gap-4">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-[1.2rem] shrink-0">
                {s.emoji}
              </div>
              <div>
                <span className="text-amber-500 text-[0.68rem] font-bold block">PASO {s.step}</span>
                <h4 className="text-amber-500 font-bold text-[0.88rem] mb-0.5">{s.title}</h4>
                <p className="text-slate-400 text-[0.78rem] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}