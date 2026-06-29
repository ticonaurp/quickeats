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
      // 🛠️ Creamos un payload explícito formateado para tu esquema de Prisma 7
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        role: "USER" // 👈 Obligatorio para evitar el Error 500 por campo faltante
      };

      // 🌐 Obtenemos la URL del API Gateway de forma dinámica de las variables de entorno
      // Si la variable no existe (como en local), usará 'http://localhost:3001' como respaldo
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      console.log(`🚀 Enviando datos al Gateway (${baseUrl}):`, payload);

      const response = await fetch(`${baseUrl}/auth/register`, { // 👈 Cambiado a plantilla dinámica
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      // Parseamos la respuesta de forma segura por si el servidor no devuelve un JSON válido
      const data = await response.json().catch(() => null);
      console.log('📥 Respuesta del servidor:', { status: response.status, data });

      if (response.ok) {
        toast.success('¡Usuario registrado con éxito!');
        router.push('/login');
      } else {
        // Manejador por si NestJS devuelve un array de errores de validación (class-validator)
        if (data && Array.isArray(data.message)) {
          toast.error(`Validación: ${data.message.join(', ')}`);
        } else {
          toast.error(data?.message || `Error del servidor (Código ${response.status})`);
        }
      }
    } catch (error) {
      console.error('💥 Error en el Fetch:', error);
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
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-black bg-white placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-black bg-white placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-black bg-white placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
          className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3.5 text-base text-black bg-white placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
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
            className="h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
            required
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-600">
            Acepto los términos, condiciones y la política de privacidad.
          </label>
        </div>
      </div>

      {/* Botón de Registrarse con identidad naranja */}
      <button
        type="submit"
        className="w-full bg-linear-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-bold text-base mt-2 hover:opacity-95 shadow-md shadow-orange-500/10 transition-all"
      >
        Registrarse
      </button>
    </form>
  );
}