"use client";

import { useState, useEffect } from "react";
import { StarRatingDisplay } from "@/components/lms/StarRating";
import { ReviewFormModal } from "@/components/lms/ReviewForm";
import { ReviewList } from "@/components/lms/ReviewList";
import { Button } from "@/components/ui/button";
import { getCourseReviews, getUserReview, getCourseRating } from "@/app/actions/reviews";
import { Star, Pencil, PenIcon } from "lucide-react";

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

interface ReviewsSectionProps {
  courseId: string;
  hasPurchased: boolean;
  userId?: string;
}

export function ReviewsSection({ courseId, hasPurchased, userId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      const [reviewsData, ratingData, userReviewData] = await Promise.all([
        getCourseReviews(courseId),
        getCourseRating(courseId),
        hasPurchased ? getUserReview(courseId) : Promise.resolve(null),
      ]);

      setReviews(reviewsData);
      setRating(ratingData);
      setUserReview(userReviewData);
      setIsLoading(false);
    }

    loadReviews();
  }, [courseId, hasPurchased]);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          Student Reviews
        </h2>
        {hasPurchased && !userReview && (
          <Button onClick={() => setIsModalOpen(true)} className="font-bold">
            <PenIcon className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        )}
        {userReview && (
          <Button onClick={() => setIsModalOpen(true)} variant="outline" className="font-bold border-slate-200 dark:border-blue-900/50 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900/50">
            <Pencil className="w-4 h-4 mr-2" />
            Edit Your Review
          </Button>
        )}
      </div>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <div className="md:col-span-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-blue-900/50 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">
              {rating.average.toFixed(1)}
            </div>
            <StarRatingDisplay rating={rating.average} showNumber={false} size="lg" />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {rating.count} {rating.count === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-blue-900/20">
            {ratingBreakdown.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-300 w-8">{star} ★</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-slate-500 dark:text-slate-400 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          <ReviewList
            reviews={reviews}
            currentUserId={userId}
            onEdit={(review) => {
              setUserReview(review);
              setIsModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Review Form Modal */}
      <ReviewFormModal
        courseId={courseId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserReview(null);
        }}
        existingReview={userReview}
      />
    </div>
  );
}
