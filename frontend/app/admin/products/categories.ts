// 🏷️ Catálogo ÚNICO de categorías de producto (fuente de verdad para los formularios).
// Se unificó para eliminar duplicados por idioma (antes coexistían p.ej. "Chicken" y "Pollo",
// "Drinks" y "Bebidas", "Desserts" y "Postres"). Los datos de la BD ya fueron migrados a estos valores.
export interface ProductCategory {
  value: string; // lo que se guarda en la BD
  label: string; // lo que ve el admin
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { value: 'Burgers', label: 'Hamburguesas' },
  { value: 'Pizza', label: 'Pizzas' },
  { value: 'Pasta', label: 'Pastas' },
  { value: 'Pollo', label: 'Pollo' },
  { value: 'Chifa', label: 'Chifa' },
  { value: 'Chaufa', label: 'Chaufa' },
  { value: 'Tallarín', label: 'Tallarín' },
  { value: 'Sushi', label: 'Sushi' },
  { value: 'Rolls', label: 'Rolls' },
  { value: 'Risotto', label: 'Risotto' },
  { value: 'Bowls', label: 'Bowls' },
  { value: 'Ensaladas', label: 'Ensaladas' },
  { value: 'Sides', label: 'Acompañamientos' },
  { value: 'Starters', label: 'Entradas' },
  { value: 'Combos', label: 'Combos' },
  { value: 'Bebidas', label: 'Bebidas' },
  { value: 'Smoothies', label: 'Smoothies' },
  { value: 'Postres', label: 'Postres' },
  { value: 'Tortas', label: 'Tortas' },
  { value: 'General', label: 'General' },
];

export const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES.map((c) => c.value);
