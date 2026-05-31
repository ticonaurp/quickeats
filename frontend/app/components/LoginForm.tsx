// components/LoginForm.tsx
'use client';
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('¡Bienvenido de nuevo!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <div className="flex items-center justify-between mb-2">
          <label className="block text-base font-medium text-gray-700">Contraseña</label>
          <button type="button" className="text-sm font-medium text-green-500 hover:underline">¿Olvidaste tu contraseña?</button>
        </div>
        <div className="relative">
          <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPass ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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

      {/* Botón de Enviar */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-green-500 text-white font-semibold text-lg transition-all hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}