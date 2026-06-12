'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation'; // Hook para leer la URL
import { createOrder } from '@/app/services/order.service';
import { getUserId } from '@/app/services/auth';

export default function CheckoutScreen() {
  const searchParams = useSearchParams();

  // 🎯 Capturamos los datos dinámicos desde la URL
  const productId = searchParams.get('productId') || '';
  const productName = searchParams.get('name') || 'Producto seleccionado';
  const productPrice = parseFloat(searchParams.get('price') || '0');

  // 🔐 Obtenemos el id del usuario autenticado a partir del token JWT
  const userId = getUserId();

  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleConfirmOrder = async () => {
    if (!productId) {
      setErrorMessage('No se ha seleccionado ningún producto válido.');
      return;
    }

    // 🔐 Sin sesión activa no podemos asociar la orden a un usuario
    if (!userId) {
      setErrorMessage('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await createOrder({
        userId,
        productId,
        quantity,
      });
      setSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#4caf50' }}>
        <h2>🎉 ¡Pedido Confirmado Exitosamente!</h2>
        <p>Tu orden ya está en la cocina en estado PENDING.</p>
        <button onClick={() => window.location.href = '/orders'} style={buttonStyle}>
          Ir a mis pedidos
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2>Resumen de tu Pedido</h2>
      <hr style={{ borderColor: '#333' }} />
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px' }}>
        <h3>{productName}</h3>
        <p style={{ color: '#ccc' }}>Precio unitario: S/. {productPrice.toFixed(2)}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <label>Cantidad:</label>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: '60px', padding: '5px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
          />
        </div>
        
        <h4 style={{ marginTop: '15px', color: '#e63946' }}>
          Total: S/. {(productPrice * quantity).toFixed(2)}
        </h4>
      </div>

      {errorMessage && (
        <p style={{ color: '#f44336', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px' }}>
          ⚠️ {errorMessage}
        </p>
      )}

      <button 
        onClick={handleConfirmOrder} 
        disabled={loading || !productId}
        style={{ ...buttonStyle, backgroundColor: loading ? '#ccc' : '#e63946' }}
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido 🛒'}
      </button>
    </div>
  );
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
  marginTop: '10px'
};