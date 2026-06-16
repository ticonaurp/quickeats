// 📋 1. Definimos la estructura de datos por si en el panel de admin creas productos
export interface CreateProductPayload {
  name: string;
  price: number;
  description?: string;
  calories?: string;
  image?: string;
}

// 🌐 Base URL dinámica apuntando a tu API Gateway (Puerto 3001)
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 2. Función para listar los productos (🟢 CORREGIDA: Ahora acepta y concatena el restaurantId)
export const getProducts = async (restaurantId?: string) => {
  try {
    // Si viene el ID del restaurante, le pegamos a la ruta con el query param; si no, va limpia
    const url = restaurantId 
      ? `${baseUrl}/products?restaurantId=${restaurantId}` 
      : `${baseUrl}/products`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los productos');

    return data; // Devuelve el array filtrado de productos de Prisma
  } catch (error: any) {
    console.error('Error en el servicio de productos (getProducts):', error.message);
    throw error;
  }
};

// 🔍 3. Obtiene un restaurante por ID (Llama a tu RestaurantController @Get(':id'))
export const getRestaurantById = async (restaurantId: string) => {
  try {
    const response = await fetch(`${baseUrl}/restaurants/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el restaurante');

    return data; // Devuelve el objeto del restaurante real de la DB
  } catch (error: any) {
    console.error('Error en el servicio de restaurantes (getRestaurantById):', error.message);
    throw error;
  }
};