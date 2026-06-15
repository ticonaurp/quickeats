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