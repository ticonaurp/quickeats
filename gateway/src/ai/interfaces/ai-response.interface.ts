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
  isAvailable?: boolean;
  [key: string]: unknown;
}

export interface AddToCartPayload {
  productId: string;
  name: string;
  quantity: number;
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
