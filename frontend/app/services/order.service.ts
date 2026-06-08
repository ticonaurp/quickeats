// 📋 1. Definimos la estructura de datos que requiere el backend
export interface CreateOrderPayload {
  userId: string;
  productId: string;
  quantity: number;
}

// 2. Función para enviar la orden al API Gateway
export const createOrder = async (payload: CreateOrderPayload) => {
  try {
    const response = await fetch('http://localhost:3001/orders', {
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
    const response = await fetch('http://localhost:3001/orders', {
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