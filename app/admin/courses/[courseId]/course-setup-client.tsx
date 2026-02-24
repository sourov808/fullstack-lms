"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LessonList } from "@/components/lms/LessonList";
import { createLesson, reorderLessons } from "@/app/actions/lesson";
import { deleteCourse, toggleCoursePublish, updateCoursePrice } from "@/app/actions/course";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CourseSetupClient({ course, lessons: initialLessons }: { course: any, lessons: any[] }) {
  const router = useRouter();

  // State to manage optimistic UI updates for ordering
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [lessons, setLessons] = useState(initialLessons || []);

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      
      // Optimistic Update
      const updatedList = [...lessons].sort((val1, val2) => {
        const pos1 = updateData.find((x) => x.id === val1.id)?.position ?? val1.position;
        const pos2 = updateData.find((x) => x.id === val2.id)?.position ?? val2.position;
        return pos1 - pos2;
      });
      setLessons(updatedList);

      await reorderLessons(course.id, updateData);
      toast.success("Lessons reordered");
    } catch {
      toast.error("Failed to reorder lessons");
      setLessons(initialLessons); // Revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  const onEditLesson = (id: string) => {
    router.push(`/admin/courses/${course.id}/lessons/${id}`);
  };

  const onCreateLesson = async () => {
    try {
      setIsCreating(true);
      const newLesson = await createLesson(course.id);
      router.push(`/admin/courses/${course.id}/lessons/${newLesson.id}`);
      toast.success("Lesson created");
    } catch {
      toast.error("Failed to create lesson");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Course Setup: {course.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your course curriculum and lessons here.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={async () => {
              try {
                const toastId = toast.loading(course.is_published ? "Unpublishing..." : "Publishing...");
                await toggleCoursePublish(course.id, !course.is_published);
                toast.success(course.is_published ? "Course unpublished" : "Course published", { id: toastId });
                router.refresh();
              } catch {
                toast.error("Something went wrong");
              }
            }}
            variant="outline"
          >
            {course.is_published ? "Unpublish" : "Publish"}
          </Button>
          <Button
            onClick={async () => {
              if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
                try {
                  const toastId = toast.loading("Deleting course...");
                  await deleteCourse(course.id);
                  toast.success("Course deleted", { id: toastId });
                  router.push("/admin");
                  router.refresh();
                } catch {
                  toast.error("Failed to delete course");
                }
              }
            }}
            variant="destructive"
          >
            Delete Course
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-blue-900/50 shadow-sm">
        <div className="flex items-center justify-between font-medium">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Course Pricing</h2>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1 max-w-xs">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Set the price to $0 to make this course free for all students.
            </p>
            <div className="flex gap-2">
              <Button
                variant={course.price === 0 ? "default" : "outline"}
                onClick={async () => {
                  try {
                    const toastId = toast.loading("Updating price...");
                    await updateCoursePrice(course.id, 0);
                    toast.success("Course is now Free!", { id: toastId });
                    router.refresh();
                  } catch {
                    toast.error("Failed to update price");
                  }
                }}
              >
                Make Free
              </Button>
              <Button
                variant={course.price > 0 ? "default" : "outline"}
                className={course.price > 0 ? "" : "border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/50"}
                onClick={async () => {
                  const newPrice = prompt("Enter the new price for this course in USD:", "19.99");
                  if (newPrice && !isNaN(parseFloat(newPrice)) && parseFloat(newPrice) > 0) {
                    try {
                      const toastId = toast.loading("Updating price...");
                      await updateCoursePrice(course.id, parseFloat(newPrice));
                      toast.success(`Price set to $${newPrice}`, { id: toastId });
                      router.refresh();
                    } catch {
                      toast.error("Failed to update price");
                    }
                  }
                }}
              >
                Set Price (Paid)
              </Button>
            </div>
          </div>
          <div className="ml-auto text-2xl font-black text-slate-900 dark:text-white">
            {course.price === 0 ? <span className="text-green-600 dark:text-green-500">Free</span> : `$${course.price.toFixed(2)}`}
          </div>
        </div>
      </div>


      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between font-medium">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Course Curriculum</h2>
          <Button onClick={onCreateLesson} variant="outline" size="sm" disabled={isCreating} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/50">
            {isCreating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4 mr-2" />
            )}
            Add a Lesson
          </Button>
        </div>
        
        <div className="mt-4">
          <div
            className={`transition ${
              isUpdating ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {lessons.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 italic text-sm text-center py-6">
                No lessons added yet.
              </p>
            ) : (
              <LessonList
                onEdit={onEditLesson}
                onReorder={onReorder}
                items={lessons}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
