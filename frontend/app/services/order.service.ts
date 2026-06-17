// 📋 1. Definimos la sub-estructura para los platos del carrito
export interface OrderItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

// 📦 2. Definimos la estructura completa que tu NestJS CreateOrderDto exige
export interface CreateOrderPayload {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  address: string;
  deliveryNotes?: string; // Opcional
  paymentMethod: 'CARD' | 'CASH'; // Tipado estricto alineado con el backend
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItemPayload[]; // 🚀 Ahora es un arreglo de productos
}

// 🌐 Base URL dinámica para el archivo de servicios (Render o Local)
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 🚀 Enviar la orden al API Gateway
export const createOrder = async (payload: CreateOrderPayload) => {
  try {
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al procesar el pedido');
    }

    return data; 
  } catch (error: any) {
    console.error('Error en el servicio de órdenes (createOrder):', error.message);
    throw error;
  }
};

// 📋 Listar todas las órdenes de la app
export const getOrders = async () => {
  try {
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el historial');

    return data; 
  } catch (error: any) {
    console.error('Error en getOrders:', error.message);
    throw error;
  }
};

// 🔄 Actualiza el estado de una orden (panel de administrador)
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await fetch(`${baseUrl}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar el estado');

    return data; 
  } catch (error: any) {
    console.error('Error en updateOrderStatus:', error.message);
    throw error;
  }
};

// 👤 Obtiene únicamente las órdenes del usuario autenticado
export const getOrdersByUser = async (userId: string) => {
  try {
    const response = await fetch(`${baseUrl}/orders/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el historial del usuario');

    return data; 
  } catch (error: any) {
    console.error('Error en getOrdersByUser:', error.message);
    throw error;
  }
};