'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/lib/products';

export interface BoxContent {
  productId: string;
  name: string;
  emoji: string;
  quantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BoxCartItem {
  id: string;
  packId: string;
  packName: string;
  emoji: string;
  price: number;
  size: number;
  contents: BoxContent[];
}

interface CartContextType {
  items: CartItem[];
  boxes: BoxCartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  addBox: (box: Omit<BoxCartItem, 'id'>) => void;
  removeBox: (id: string) => void;
  total: number;
  count: number;
  clear: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [boxes, setBoxes] = useState<BoxCartItem[]>([]);

  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id));

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeItem(id);
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const addBox = (box: Omit<BoxCartItem, 'id'>) => {
    setBoxes(prev => [...prev, { ...box, id: `box-${Date.now()}` }]);
  };

  const removeBox = (id: string) => setBoxes(prev => prev.filter(b => b.id !== id));

  const itemsTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const boxesTotal = boxes.reduce((sum, b) => sum + b.price, 0);
  const total = itemsTotal + boxesTotal;

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const boxesCount = boxes.reduce((sum, b) => sum + b.size, 0);
  const count = itemsCount + boxesCount;

  return (
    <CartContext.Provider value={{ items, boxes, addItem, removeItem, updateQty, addBox, removeBox, total, count, clear: () => { setItems([]); setBoxes([]); } }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
