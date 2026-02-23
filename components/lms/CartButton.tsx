"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { CartSidebar } from "./CartSidebar";

export function CartButton() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 ml-2 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-200">
            {totalItems}
          </span>
        )}
      </Button>

      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
