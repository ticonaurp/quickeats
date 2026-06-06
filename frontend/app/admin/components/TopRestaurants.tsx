import { ArrowUpRight, Star } from 'lucide-react';

const restaurants = [
  { id: 1, name: 'The Burger Lab', category: 'Burgers', rating: 4.8, reviews: '2,341', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&q=80' },
  { id: 2, name: 'Sakura Ramen House', category: 'Asian', rating: 4.7, reviews: '1,820', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&q=80' },
  { id: 3, name: 'Pizzeria Da Luigi', category: 'Pizza', rating: 4.6, reviews: '942', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&q=80' },
];

export function TopRestaurants() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900 tracking-tight">Mejores Restaurantes</h2>
        <button className="flex items-center gap-1 text-xs font-bold text-green-500 hover:underline">
          Gestionar <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="space-y-3">
        {restaurants.map((r, index) => (
          <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50/80 transition-colors">
            <span className="text-sm font-black text-gray-300 w-4 text-center">{index + 1}</span>
            <img src={r.img} alt={r.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{r.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.category}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-sm font-bold text-gray-900">
                <Star size={14} className="fill-amber-400 stroke-amber-400" />
                {r.rating}
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">{r.reviews} reviews</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}