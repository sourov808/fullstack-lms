"use client";

import Link from "next/link";
import Image from "next/image";

import { useCart } from "@/context/CartContext";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  badge?: "Bestseller" | "Highest Rated" | "New";
  isPublished?: boolean;
}

export function CourseCard({
  id,
  title,
  thumbnail,
  instructor,
  rating,
  reviews,
  price,
  originalPrice,
  badge,
  isPublished = true,
}: CourseCardProps) {
  const { addToCart, isInCart } = useCart();
  const fallbackThumbnail = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
  const displayThumbnail = thumbnail && thumbnail.trim() !== "" ? thumbnail : fallbackThumbnail;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, price, thumbnail: displayThumbnail, instructor });
  };

  return (
    <div className={`bg-white rounded-xl overflow-hidden border border-slate-200 group flex flex-col h-full hover:shadow-xl hover:shadow-slate-200 transition-all ${
      !isPublished ? "opacity-90 grayscale-[0.3] pointer-events-none" : ""
    }`}>
      <Link href={isPublished ? `/courses/${id}` : "#"} className="flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={displayThumbnail}
            alt={title}
            width={500}
            height={500}
            priority
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!isPublished && (
            <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[2px] transition-all duration-500 flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/30 shadow-2xl flex items-center gap-3 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-white text-[18px]">lock</span>
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Status</span>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Coming Soon</span>
                </div>
              </div>
            </div>
          )}
          {badge && isPublished && (
            <div className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded
              ${badge === 'Bestseller' ? 'bg-yellow-400 text-yellow-950' : 'bg-primary text-white'}`}>
              {badge}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 relative">
          <div className="font-bold text-slate-900 leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-slate-500 mb-2">{instructor}</p>

          <div className="flex items-center gap-1.5 mb-auto">
            <span className="text-sm font-bold text-amber-600">{rating}</span>
            <div className="flex text-amber-500">
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span className="material-symbols-outlined text-[16px]">{rating >= 4.8 ? "star" : "star_half"}</span>
            </div>
            <span className="text-xs text-slate-400">({reviews.toLocaleString()})</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
               {price === 0 ? (
                <span className="text-lg font-black text-green-600">Free</span>
               ) : (
                  <span className="text-lg font-black text-slate-900">${price}</span>
               )}
              {originalPrice && price > 0 && (
                <span className="text-sm text-slate-400 line-through">${originalPrice}</span>
              )}
            </div>
            {isPublished && (
              <button 
                onClick={handleAddToCart}
                disabled={isInCart(id)}
                className={`p-2 rounded-full transition-all ${
                  isInCart(id) 
                    ? "text-green-600 bg-green-50" 
                    : "text-primary hover:bg-primary/5"
                }`}
              >
                <span className="material-symbols-outlined">
                  {isInCart(id) ? "shopping_cart_checkout" : "add_shopping_cart"}
                </span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
