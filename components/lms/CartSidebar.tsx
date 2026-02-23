"use client";

import React, { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const context = useContext(CartContext);
  
  // Don't render if outside of CartProvider
  if (!context) {
    return null;
  }

  const { items, removeFromCart, totalPrice, totalItems, clearCart } = context;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-slate-900">Your Cart ({totalItems})</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500">Your cart is empty.</p>
              <Button onClick={onClose} variant="outline" asChild>
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                  <Image 
                    src={item.thumbnail} 
                    alt={item.title} 
                    width={80} 
                    height={80} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">By {item.instructor}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">${item.price.toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total:</span>
              <span className="text-2xl font-black text-slate-900">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button size="lg" className="w-full font-bold shadow-lg shadow-primary/20">
                Proceed to Checkout
              </Button>
              <Button variant="ghost" onClick={clearCart} className="text-slate-500 text-xs">
                Clear all items
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
