"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function RegisterForm() {
  const router = useRouter();
  
  // Estados para capturar todos los campos
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación: Que las contraseñas coincidan
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // 2. Validación: Que haya aceptado la política
    if (!acceptTerms) {
      toast.error('Debes aceptar la política de privacidad para continuar');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Usuario registrado con éxito!');
        router.push('/login');
      } else {
        toast.error(data.message || 'Error al registrar');
      }
    } catch (error) {
      toast.error('Error de conexión con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* 1. Campo de Nombre Completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input
          type="text"
          placeholder="Ej. Alejandro Briceño"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm text-black focus:border-[#22C55E] focus:ring-[#22C55E]"
          required
        />
      </div>

      {/* 2. Campo de Correo Electrónico */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm text-black focus:border-[#22C55E] focus:ring-[#22C55E]"
          required
        />
      </div>

      {/* 3. Campo de Contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm text-black focus:border-[#22C55E] focus:ring-[#22C55E]"
          required
        />
      </div>

      {/* 4. Campo de Confirmar Contraseña */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
        <input
          type="password"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm text-black focus:border-[#22C55E] focus:ring-[#22C55E]"
          required
        />
      </div>

      {/* 5. Checkbox de Política de Privacidad y Términos */}
      <div className="flex items-start mt-2">
        <div className="flex h-5 items-center">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#22C55E] focus:ring-[#22C55E]"
            required
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-600">
            Acepto los términos, condiciones y la política de privacidad.
          </label>
        </div>
      </div>

      {/* Botón de Registrarse en color VERDE oficial */}
      <button 
        type="submit" 
        className="w-full bg-[#22C55E] text-white p-2 rounded-md font-bold mt-2 hover:bg-green-600 transition-colors"
      >
        Registrarse
      </button>
    </form>
  );
}