export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  category: string;
  isPopular?: boolean;
}

export const LOCAL_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🍽️' },
  { id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'asiatica', name: 'Asiática', emoji: '🥢' },
  { id: 'italiana', name: 'Italiana', emoji: '🍝' },
  { id: 'chifa', name: 'Chifa', emoji: '🥡' },
  { id: 'pollerias', name: 'Pollerías', emoji: '🍗' },
  { id: 'saludable', name: 'Saludable', emoji: '🥗' },
  { id: 'postres', name: 'Postres', emoji: '🍰' },
];

export const RESTAURANTS_MOCK: Restaurant[] = [
  { id: '1', name: 'Taco Loco', cuisine: 'Mexican • Street Food', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', deliveryTime: '20', deliveryFee: 4.50, isOpen: true, category: 'tacos', isPopular: false },
  { id: '2', name: 'Burger Republic', cuisine: 'American • Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80', deliveryTime: '25', deliveryFee: 0, isOpen: true, category: 'burgers', isPopular: true },
  { id: '3', name: 'Green Bowl', cuisine: 'Healthy • Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80', deliveryTime: '25', deliveryFee: 0, isOpen: true, category: 'saludable', isPopular: false },
  { id: '4', name: 'Pizza Artisan', cuisine: 'Italian • Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', deliveryTime: '30', deliveryFee: 5.00, isOpen: true, category: 'pizza', isPopular: true },
  { id: '5', name: 'The Gourmet Table', cuisine: 'International • Fine Dining', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80', deliveryTime: '45', deliveryFee: 8.00, isOpen: false, category: 'italiana', isPopular: false }
];