"use client";

import { useState, useEffect } from "react";
import { updateLessonProgress } from "@/app/actions/course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MarkCompleteButtonProps {
  lessonId: string;
  courseId: string;
  nextLessonId?: string | null;
  initialCompleted: boolean;
}

export function MarkCompleteButton({ lessonId, courseId, nextLessonId, initialCompleted }: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  // Show welcome animation on first load if this is the very first interaction
  useEffect(() => {
    const key = `welcomed-${courseId}`;
    if (!localStorage.getItem(key)) {
      setShowWelcome(true);
      localStorage.setItem(key, "true");
      setTimeout(() => setShowWelcome(false), 3500);
    }
  }, [courseId]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newState = !completed;
      await updateLessonProgress(lessonId, newState);
      setCompleted(newState);
      if (newState) {
        toast.success("🎉 Lesson completed!", { description: "Keep going — great progress!" });
        if (nextLessonId) {
          setTimeout(() => router.push(`/courses/${courseId}/chapters/${nextLessonId}`), 1200);
        }
      } else {
        toast.info("Lesson marked as incomplete.");
      }
    } catch {
      toast.error("Failed to update progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Welcome Overlay Animation */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
          <div className="text-center text-white animate-in zoom-in-75 duration-500 space-y-4 p-8">
            <div className="text-7xl animate-bounce">🎓</div>
            <h1 className="text-4xl font-black tracking-tight">Welcome to the Course!</h1>
            <p className="text-xl text-white/80">You&apos;re all set. Let&apos;s start learning!</p>
            <div className="mt-4 flex gap-2 justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-white/60 animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mark Complete Button */}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
          ${completed
            ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
            : "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
          }
          ${loading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <span className="material-symbols-outlined text-[18px]">
          {completed ? "check_circle" : "radio_button_unchecked"}
        </span>
        {loading ? "Saving..." : completed ? "Completed!" : "Mark as Complete"}
      </button>
    </>
  );
}
