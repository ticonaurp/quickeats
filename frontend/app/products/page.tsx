'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 📋 Definimos la estructura del producto según la data de tu restaurant-service
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  createdAt: string;
  restaurantId: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Consumimos el catálogo de productos a través del Gateway (3001)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products');
        
        if (!response.ok) {
          throw new Error('No se pudo cargar el catálogo de productos');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🚀 Navegación dinámica hacia la pantalla de Checkout enviando Query Params
  const handleBuyClick = (product: Product) => {
    const queryParams = new URLSearchParams({
      productId: product.id,
      name: product.name,
      price: product.price.toString(),
    }).toString();

    router.push(`/checkout?${queryParams}`);
  };

  if (loading) return <div style={centerTextStyle}>Cargando especialidades de QuickEats...</div>;
  if (error) return <div style={{ ...centerTextStyle, color: '#f44336' }}>⚠️ Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>🍔 Nuestro Catálogo de Especialidades</h2>
      
      {products.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>No hay productos disponibles en este momento.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {products.map((product) => (
            <div key={product.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ flex: 1, paddingRight: '20px' }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>{product.name}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ccc' }}>
                    {product.description || 'Sin descripción adicional.'}
                  </p>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#e63946' }}>
                    S/. {product.price.toFixed(2)}
                  </span>
                </div>
                
                <div>
                  <button 
                    onClick={() => handleBuyClick(product)} 
                    style={buyButtonStyle}
                  >
                    Comprar 🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 🎨 Estilos limpios y adaptados a tu Dark Mode
const centerTextStyle = {
  textAlign: 'center' as const,
  padding: '40px',
  color: '#fff',
  fontFamily: 'sans-serif'
};

const cardStyle = {
  padding: '20px',
  backgroundColor: '#111',
  border: '1px solid #222',
  borderRadius: '10px',
  display: 'flex',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
};

const buyButtonStyle = {
  backgroundColor: '#e63946',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
  transition: 'background-color 0.2s',
};