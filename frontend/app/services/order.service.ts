// 📋 1. Definimos la estructura de datos que requiere el backend
export interface CreateOrderPayload {
  userId: string;
  productId: string;
  quantity: number;
}

// 🌐 Base URL dinámica para el archivo de servicios (Render o Local)
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 2. Función para enviar la orden al API Gateway
export const createOrder = async (payload: CreateOrderPayload) => {
  try {
    const response = await fetch(`${baseUrl}/orders`, { // 👈 Cambiado a plantilla dinámica
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Si el Gateway o el Order-Service responden con un error (ej: 400 o 404)
    if (!response.ok) {
      // Capturamos el mensaje controlado que configuramos en el backend
      throw new Error(data.message || 'Error al procesar el pedido');
    }

    return data; // Retorna la orden creada (contiene id, status "PENDING", etc.)
  } catch (error: any) {
    console.error('Error en el servicio de órdenes:', error.message);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await fetch(`${baseUrl}/orders`, { // 👈 Cambiado a plantilla dinámica
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el historial');

    return data; // Devuelve el array de órdenes
  } catch (error: any) {
    console.error('Error en getOrders:', error.message);
    throw error;
  }
};

// 🔄 Actualiza el estado de una orden (usado por el panel de administrador)
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

    return data; // Devuelve la orden ya actualizada
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
    if (!response.ok) throw new Error(data.message || 'Error al obtener el historial');

    return data; // Devuelve el array de órdenes del usuario
  } catch (error: any) {
    console.error('Error en getOrdersByUser:', error.message);
    throw error;
  }
};