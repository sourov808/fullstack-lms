"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => handleClick(star)}
          className={cn(
            "transition-colors",
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
            star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"
          )}
        >
          <Star className={sizeClasses[size]} />
        </button>
      ))}
    </div>
  );
}

export function StarRatingDisplay({
  rating,
  showNumber = true,
  size = "md",
  className,
}: {
  rating: number;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <StarRating rating={Math.round(rating)} size={size} />
      {showNumber && (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
