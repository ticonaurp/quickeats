// 📦 Forma esperada de la respuesta del order-service al consultar una orden
export interface OrderStatusServiceResponse {
  id: string;
  status: string;
  restaurantName: string;
  [key: string]: unknown;
}

// 📦 Forma esperada de cada producto devuelto por el restaurant-service
export interface ProductServiceItem {
  id: string;
  name: string;
  price?: number;
  image?: string;
  calories?: number;
  restaurantId: string;
  isAvailable?: boolean;
  [key: string]: unknown;
}

// 📦 Forma esperada del restaurante devuelto por el restaurant-service
export interface RestaurantServiceItem {
  id: string;
  name: string;
  deliveryFee?: number;
  deliveryTime?: number;
  isOpen?: boolean;
  [key: string]: unknown;
}

export interface AddToCartPayload {
  productId: string;
  name: string;
  price: number;
  image: string;
  calories: number | null;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  restaurantDeliveryFee: number;
  restaurantDeliveryTime: number;
}

// 🔧 Contrato estricto que el frontend espera para ejecutar una acción sobre el carrito
export interface AddToCartActionResponse {
  type: 'action';
  action: 'ADD_TO_CART';
  payload: AddToCartPayload;
  message: string;
}

// 💬 Respuesta conversacional simple, sin acción asociada
export interface AiTextResponse {
  type: 'message';
  message: string;
}

export type AiChatResponse = AddToCartActionResponse | AiTextResponse;

export interface GetOrderStatusArgs {
  orderId: string;
}

export interface AddProductToCartArgs {
  productName: string;
  quantity?: number;
}
