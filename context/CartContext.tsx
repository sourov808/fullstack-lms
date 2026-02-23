"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  instructor: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("edustream-cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }
    }
    return [];
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("edustream-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        toast.info("Item already in cart");
        return prev;
      }
      toast.success(`${item.title} added to cart`);
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (id: string) => items.some((item) => item.id === id);

  const totalItems = items.length;
  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
