"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}
