"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createCourse } from "@/app/actions/course";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z.string().optional(),
  category: z.string().optional().default("Development"),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number",
  }).default(0),
  thumbnail: z.any().optional(), // For file upload representing thumbnail_url
  is_published: z.boolean().default(false),
});

type CourseFormValues = z.infer<typeof formSchema>;

export default function CreateCoursePage() {
  const router = useRouter();

  const form = useForm<CourseFormValues>({
    // @ts-expect-error Zod version mismatch with hookform resolvers
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      is_published: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      await createCourse(values);
      toast.success("Course created successfully!");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create New Course
        </h1>
        <p className="text-slate-500 mt-2">
          Provide the basic details for your new course.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced React Patterns'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course will teach you...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="IT & Software">IT & Software</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control={form.control as any}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Price (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        disabled={isSubmitting}
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control={form.control as any}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base cursor-pointer">
                        Published
                      </FormLabel>
                      <FormDescription>
                        Make this course instantly accessible.
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
            </div>

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Thumbnail</FormLabel>
                  <FormControl>
                    <FileUpload
                      accept={{
                        "image/*": [".jpeg", ".png", ".jpg", ".webp"],
                      }}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image that visually represents your course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 pt-4 border-t border-slate-100 mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Create Course
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
