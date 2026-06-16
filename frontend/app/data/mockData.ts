export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  deliveryTime: number; 
  deliveryFee: number;  
  image: string;        
  isOpen: boolean;
  isFeatured: boolean;
  products?: Product[];
}

export const LOCAL_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🍽️' },
  { id: 'Burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'Pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'Asiática', name: 'Asiática', emoji: '🥢' },
  { id: 'Italiana', name: 'Italiana', emoji: '🍝' },
  { id: 'Chifa', name: 'Chifa', emoji: '🥡' },
  { id: 'Pollerías', name: 'Pollerías', emoji: '🍗' },
  { id: 'Saludable', name: 'Saludable', emoji: '🥗' },
  { id: 'Postres', name: 'Postres', emoji: '🍰' },
];


// 🟢 Agrega la interfaz Order que le falta a tu proyecto
export interface Order {
  id: string;
  restaurantName: string;
  restaurantId: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: Date;
  estimatedDelivery: string;
  address: string;
}

// 🟢 Agrega el array de RESTAURANTS de prueba para que tu .find() pueda buscar el restaurante
export const RESTAURANTS: Restaurant[] = [
  {
    id: '1', // Asegúrate de que este ID coincida con el que pruebes en el carrito
    name: 'Burger Republic',
    description: 'Las mejores hamburguesas smash de la ciudad.',
    category: 'Burgers',
    address: 'Av. Larco 123, Miraflores',
    deliveryTime: 30,
    deliveryFee: 1.99, // Fiel a tu Figma
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    isOpen: true,
    isFeatured: true
  }
];