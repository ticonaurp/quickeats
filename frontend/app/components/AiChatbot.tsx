'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getUserId } from '../services/auth';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isAction?: boolean;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', sender: 'bot', text: '¡Hola! Soy tu asistente de QuickEats con IA. Puedes preguntarme el estado de tus pedidos o pedirme que agregue platos a tu carrito.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Control para evitar pisar el localStorage al arrancar
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Cargar historial del LocalStorage al montar el componente (Seguro para SSR/Next.js)
  useEffect(() => {
    const savedMessages = localStorage.getItem('quickeats_chat_history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (err) {
        console.error('Error al restaurar el historial del chat:', err);
      }
    }
    setIsInitialized(true);
  }, []);

  // 2. Guardar automáticamente en LocalStorage cada vez que cambien los mensajes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('quickeats_chat_history', JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  // Auto-scroll al último mensaje recibido
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Función para limpiar el chat de pantalla y disco de forma segura
  const handleClearChat = () => {
    const defaultMessage: Message[] = [
      { id: 'welcome', sender: 'bot', text: '¡Hola! Soy tu asistente de QuickEats con IA. Puedes preguntarme el estado de tus pedidos o pedirme que agregue platos a tu carrito.' }
    ];
    setMessages(defaultMessage);
    localStorage.removeItem('quickeats_chat_history');
    toast.info('Historial del chat borrado');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    
    // Renderizar mensaje del usuario de inmediato
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const gatewayUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const userId = getUserId() || undefined;

      // 🧠 PASO 3 OPTIMIZADO: Filtrar las acciones pasadas para que no compitan con el Function Calling
      const formattedHistory = messages
        .filter((msg) => !msg.isAction && msg.id !== 'welcome') // Omitimos logs de carritos y saludos
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: msg.text }],
        }));

      // Buscamos el índice del primer mensaje que realmente envió el usuario (Garantiza regla de Google)
      const firstUserIndex = formattedHistory.findIndex((msg) => msg.role === 'user');
      let cleanHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

      // Si el filtro de arriba rompió la alternancia estricta, reiniciamos el array para darle prioridad al mensaje actual
      if (cleanHistory.length > 1 && cleanHistory[cleanHistory.length - 1].role === 'user') {
        cleanHistory = []; 
      }

      // Consumir el módulo de IA del Gateway incluyendo el historial refinado
      const response = await fetch(`${gatewayUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          userId,
          history: cleanHistory
        }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      console.log("👉 RESPUESTA COMPLETA DE LA IA:", data); // Log de diagnóstico en consola

      // Evaluar si la IA devolvió una ACCIÓN REAL (Function Calling)
      if (data.type === 'action' && data.action === 'ADD_TO_CART') {
        const { productId, name, quantity } = data.payload;

        // Extraer carrito actual del LocalStorage
        const currentCart = JSON.parse(localStorage.getItem('quickeats_cart') || '[]');
        
        // Verificar si el producto ya existía para sumar cantidades
        const existingItemIndex = currentCart.findIndex((item: any) => (item.id === productId || item.productId === productId));
        
        if (existingItemIndex > -1) {
          currentCart[existingItemIndex].quantity += quantity;
        } else {
          currentCart.push({
            id: productId,
            productId: productId,
            name: name,
            price: 18.90, 
            quantity: quantity
          });
        }

        // Guardar cambios e impactar la UI del frontend de inmediato
        localStorage.setItem('quickeats_cart', JSON.stringify(currentCart));
        
        // Disparar un evento global nativo para que el TopNavbar/CartSidebar se enteren y se refresquen solos
        window.dispatchEvent(new Event('storage'));
        toast.success(`¡${name} añadido al carrito por la IA! 🛒`);

        setMessages((prev) => [
          ...prev, 
          { id: Date.now().toString(), sender: 'bot', text: data.message, isAction: true }
        ]);
      } else {
        // Respuesta puramente textual o conversacional
        setMessages((prev) => [
          ...prev, 
          { id: Date.now().toString(), sender: 'bot', text: data.message }
        ]);
      }

    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { id: Date.now().toString(), sender: 'bot', text: 'Lo siento, tuve un problema de conexión con el servidor de inteligencia artificial.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">
      {/* 🔮 BOTÓN FLOTANTE PRINCIPAL */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all duration-200 group"
        >
          <Sparkles size={18} className="animate-pulse group-hover:rotate-12 transition-transform" />
          <span>¿Qué vas a pedir hoy?</span>
          <MessageSquare size={18} />
        </button>
      )}

      {/* 💬 VENTANA FLOTANTE DEL AGENTE */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white rounded-3xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Cabecera de la ventana */}
          <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">Asistente QuickEats AI</h3>
                <p className="text-[10px] text-amber-100 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  Agente inteligente activo
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Botón para limpiar historial de chat */}
              {messages.length > 1 && (
                <button
                  onClick={handleClearChat}
                  title="Borrar historial"
                  className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-red-500/20 text-white transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Caja de mensajes (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0 text-xs">
                    <Bot size={14} />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                    msg.sender === 'user' 
                      ? 'bg-slate-950 text-white rounded-tr-none' 
                      : msg.isAction 
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tl-none flex items-center gap-2'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.isAction && <ShoppingCart size={14} className="text-emerald-500 shrink-0" />}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                  <Bot size={14} className="animate-spin" />
                </div>
                <div className="bg-white border border-slate-100 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs text-slate-400 font-medium">
                  Pensando la mejor opción para ti...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario Inferior de Escritura */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta por un pedido o pide agregar un plato..."
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-amber-500"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}