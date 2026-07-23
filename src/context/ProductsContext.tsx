import React, { createContext, useContext, useState } from 'react';
import { Product } from '../models/Product';

// ─── Tipos do contexto ────────────────────────────────────────────────────────

interface ProductsContextData {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
}

// ─── Criação do contexto ──────────────────────────────────────────────────────

const ProductsContext = createContext<ProductsContextData>({} as ProductsContextData);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: Date.now().toString() }]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const clearProducts = () => setProducts([]);

  return (
    <ProductsContext.Provider value={{ products, addProduct, removeProduct, clearProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProducts = () => useContext(ProductsContext);
