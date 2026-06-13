'use client';

import React, { useEffect, useState } from 'react';
import { getOrdersByUser } from '@/app/services/order.service';
import { getUserId } from '@/app/services/auth';

interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export default function OrdersHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 🔐 Solo pedimos las órdenes del usuario que tiene la sesión activa
        const userId = getUserId();
        if (!userId) {
          setError('Tu sesión expiró. Por favor, inicia sesión nuevamente.');
          return;
        }

        const data = await getOrdersByUser(userId);
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Función helper para darle color a los estados en el Dark Mode
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#4caf50'; // Verde
      case 'PENDING': return '#ffb74d'; // Naranja
      case 'PREPARING': return '#29b6f6'; // Azul
      case 'CANCELLED': return '#f44336'; // Rojo
      default: return '#fff';
    }
  };

  if (loading) return <div style={centerText}>Cargando historial de pedidos...</div>;
  if (error) return <div style={{ ...centerText, color: '#f44336' }}>⚠️ Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>📋 Mis Pedidos</h2>
      
      {orders.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>No tienes pedidos registrados todavía.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#e63946' }}>Orden #{order.id.substring(0, 8)}</h4>
                  <p style={{ margin: '0', fontSize: '14px', color: '#ccc' }}>ID Producto: {order.productId}</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Cantidad: <strong>{order.quantity}</strong></p>
                </div>
                <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    backgroundColor: '#222',
                    border: `1px solid ${getStatusColor(order.status)}`,
                    color: getStatusColor(order.status)
                  }}>
                    {order.status}
                  </span>
                  <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#777' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const centerText = {
  textAlign: 'center' as const,
  padding: '40px',
  color: '#fff',
  fontFamily: 'sans-serif'
};

const cardStyle = {
  padding: '20px',
  backgroundColor: '#111',
  border: '1px solid #222',
  borderRadius: '10px',
  display: 'flex',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
};