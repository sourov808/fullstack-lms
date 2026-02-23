"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/app/actions/course";
import { toast } from "sonner";

interface EnrollButtonProps {
  courseId: string;
  price: number;
  hasPurchased: boolean;
}

export function EnrollButton({ courseId, price, hasPurchased }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (hasPurchased) {
    return (
      <Button
        size="lg"
        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold"
        onClick={() => router.push(`/courses/${courseId}/chapters`)}
      >
        <span className="material-symbols-outlined mr-2 text-[18px]">play_circle</span>
        Go to Course
      </Button>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const result = await enrollInCourse(courseId);
      if (result.success) {
        toast.success("🎉 You're enrolled! Welcome to the course!", {
          description: "All lessons are now unlocked. Start learning!",
          duration: 5000,
        });
        router.push(`/courses/${courseId}/chapters`);
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to enroll";
      if (message === "Unauthorized") {
        toast.error("Please log in to enroll in this course.");
        router.push("/login");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (price > 0) {
    // Paid course — show "Buy Now" (cart add, not direct enroll)
    return (
      <Button
        size="lg"
        className="w-full md:w-auto font-bold"
        disabled={loading}
        onClick={() => {
          toast.info("Add to cart and checkout to enroll.");
        }}
      >
        <span className="material-symbols-outlined mr-2 text-[18px]">shopping_cart</span>
        Enroll for ${price}
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold"
      disabled={loading}
      onClick={handleEnroll}
    >
      {loading ? (
        <>
          <span className="material-symbols-outlined mr-2 text-[18px] animate-spin">progress_activity</span>
          Enrolling...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined mr-2 text-[18px]">school</span>
          Get for Free
        </>
      )}
    </Button>
  );
}
