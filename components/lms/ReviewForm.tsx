"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/lms/StarRating";
import { createReview, updateReview } from "@/app/actions/reviews";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ReviewFormProps {
  courseId: string;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  courseId,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReview) {
        await updateReview(existingReview.id, rating, comment);
        toast.success("Review updated successfully!");
      } else {
        await createReview({ course_id: courseId, rating, comment });
        toast.success("Review submitted successfully!");
      }

      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Rating
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
        {rating > 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Review (optional)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this course..."
          rows={4}
          className="resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          maxLength={1000}
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
          {comment.length}/1000 characters
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="font-bold"
        >
          {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-slate-200 dark:border-slate-700"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export function ReviewFormModal({
  courseId,
  isOpen,
  onClose,
  existingReview,
}: {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
  existingReview?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {existingReview ? "Edit Your Review" : "Write a Review"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
        <ReviewForm
          courseId={courseId}
          existingReview={existingReview}
          onSuccess={() => {
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
