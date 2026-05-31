// components/RegisterForm.tsx
'use client';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function RegisterForm() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (!agreeTerms) {
      toast.error('Debes aceptar los Términos de Servicio y la Política de Privacidad');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('¡Cuenta creada con éxito! Bienvenido.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre Completo */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">Nombre completo</label>
        <div className="relative">
          <User size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Correo Electrónico */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">Correo electrónico</label>
        <div className="relative">
          <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">Contraseña</label>
        <div className="relative">
          <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPass ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mín. 6 caracteres"
            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white placeholder-gray-500"
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">Confirmar contraseña</label>
        <div className="relative">
          <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPass ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Checkbox de Términos y Condiciones */}
      <div className="flex items-start gap-3 pt-1">
        <input
          id="terms"
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-green-500 focus:ring-green-500 cursor-pointer"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 leading-tight cursor-pointer select-none">
          Acepto los{' '}
          <Link href="/terms" className="font-semibold text-green-500 hover:underline">
            Términos de Servicio
          </Link>{' '}
          y la{' '}
          <Link href="/privacy" className="font-semibold text-green-500 hover:underline">
            Política de Privacidad
          </Link>
        </label>
      </div>

      {/* Botón de Envío */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-green-500 text-white font-semibold text-lg transition-all hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
}