"use client";

import { useState } from "react";
import { StarRating } from "@/components/lms/StarRating";
import { Button } from "@/components/ui/button";
import { deleteReview } from "@/app/actions/reviews";
import { toast } from "sonner";
import { Pencil, Trash2, User } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  onEdit?: (review: Review) => void;
}

export function ReviewList({ reviews, currentUserId, onEdit }: ReviewListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete your review?")) return;

    setIsDeleting(reviewId);
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete review";
      toast.error(message);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">No reviews yet</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Be the first to review this course</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isOwnReview = currentUserId === review.user_id;
        const fullName = review.profiles?.first_name
          ? `${review.profiles.first_name} ${review.profiles.last_name || ""}`
          : "Anonymous";
        const avatarUrl = review.profiles?.avatar_url;

        return (
          <div
            key={review.id}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-600"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(review.created_at)}</p>
                </div>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            {review.comment && (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{review.comment}</p>
            )}

            {isOwnReview && (
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(review)}
                    className="text-slate-500 dark:text-slate-400 hover:text-primary"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(review.id)}
                  disabled={isDeleting === review.id}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {isDeleting === review.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
