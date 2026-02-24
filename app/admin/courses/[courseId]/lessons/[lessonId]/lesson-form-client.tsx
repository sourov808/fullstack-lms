"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { updateLesson, deleteLesson } from "@/app/actions/lesson";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/file-upload";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  is_free: z.boolean().default(false),
});

type LessonFormValues = z.infer<typeof formSchema>;

export function LessonFormClient({
  initialData,
  courseId,
  lessonId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any;
  courseId: string;
  lessonId: string;
}) {
  const router = useRouter();

  const form = useForm<LessonFormValues>({
    // @ts-expect-error Zod version mismatch with hookform resolvers
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      content: initialData.description || "",
      video_url: initialData.video_url || "",
      is_free: initialData.is_free || false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: LessonFormValues) => {
    try {
      await updateLesson(lessonId, {
        title: values.title,
        content: values.content || undefined,
        video_url: values.video_url || undefined,
        is_free: values.is_free,
      });

      toast.success("Lesson updated successfully!");
      router.push(`/admin/courses/${courseId}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong saving the lesson.");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full">
          <Button
            onClick={() => router.push(`/admin/courses/${courseId}`)}
            variant="ghost"
            className="mb-4 pl-0 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edit Lesson
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Complete all required fields and upload your video.
          </p>
        </div>
        <div>
          <Button
            type="button"
            variant="destructive"
            onClick={async () => {
              if (confirm("Are you sure you want to delete this lesson? This cannot be undone.")) {
                try {
                  const toastId = toast.loading("Deleting lesson...");
                  await deleteLesson(lessonId, courseId);
                  toast.success("Lesson deleted", { id: toastId });
                  router.push(`/admin/courses/${courseId}`);
                  router.refresh();
                } catch {
                  toast.error("Failed to delete lesson");
                }
              }
            }}
          >
            Delete Lesson
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-blue-900/50 shadow-sm space-y-6">
        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6 mt-4">
            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the Course'"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Description/Content</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      className="min-h-[140px]"
                      placeholder="Discuss the key takeaways from this lesson..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="is_free"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 dark:border-blue-900/50 p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base cursor-pointer">
                      Free Preview
                    </FormLabel>
                    <FormDescription>
                      Check this box if you want to make this lesson free for preview.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      disabled={isSubmitting}
                      checked={!!field.value}
                      onChange={field.onChange}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Video</FormLabel>
                  <FormControl>
                    <FileUpload
                      endpoint="video"
                      accept={{
                        "video/*": [".mp4", ".mov", ".mkv", ".webm"],
                      }}
                      onChange={field.onChange}
                      value={field.value || undefined}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload the primary video for this chapter from your browser directly to Cloudinary.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 pt-4 border-t border-slate-100 dark:border-blue-900/50 mt-6">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save Lesson
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
