'use client';
import { useState, Suspense } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation'; 
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

function LoginFields() {
  const router = useRouter(); 
  const searchParams = useSearchParams(); 
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log("🚀 Intentando conectar al backend en:", `${baseUrl}/auth/login`);

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`¡Bienvenido de nuevo, ${data.name || 'Usuario'}!`);

        // 🛡️ Establecemos el estado de sesión seguro coordinado con auth.ts
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('name', data.name || 'Usuario');
        localStorage.setItem('email', email); // Guardamos el email usado
        localStorage.setItem('userId', data.userId || data.id || 'uid-mock-123'); // ID para el microservicio de órdenes
        
        // Normalizamos el rol a mayúsculas para evitar fallos de formato
        const userRole = (data.role || 'USER').toUpperCase();
        localStorage.setItem('role', userRole);

        // 🔑 REDIRECCIÓN BLINDADA INTELIGENTE:
        const redirectParam = searchParams.get('redirect');
        
        if (redirectParam) {
          router.push(redirectParam);
        } else if (userRole === 'ADMIN') {
          router.push('/admin'); 
        } else {
          router.push('/user'); 
        }
      } else {
        toast.error(data.message || 'Error al iniciar sesión. Revisa tus credenciales.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('No se pudo conectar con el servidor. ¿El Gateway está encendido?');
    } finally {
      setLoading(false); 
    }
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
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-base text-black focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white placeholder-gray-500 disabled:opacity-60"
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
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-base text-black focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white placeholder-gray-500 disabled:opacity-60"
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
        className="w-full py-4 rounded-xl bg-slate-900 text-white font-semibold text-lg transition-all hover:bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-gray-400 animate-pulse">Cargando módulo de acceso...</div>}>
      <LoginFields />
    </Suspense>
  );
}