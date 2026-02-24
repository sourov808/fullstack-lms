import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Admin Guide & Architecture
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Understand how your Learning Management System operates, from styling to data logic.
        </p>
      </div>

      {/* App Structure / Workflow */}
      <Card className="border-slate-200 dark:border-blue-900/50 shadow-sm border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-blue-900/50">
          <CardTitle className="text-xl">Application Flow</CardTitle>
          <CardDescription className="dark:text-slate-400">How the different user types interact with your platform.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden">
             
            <div className="text-center z-10 w-full md:w-1/3 p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-blue-900/50 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-blue-500 mb-2">admin_panel_settings</span>
                <h3 className="font-bold text-slate-900 dark:text-white">1. Instructors (You)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Create & Manage Courses, upload videos, shape the curriculum.</p>
            </div>

            <MoveRight className="hidden md:block w-8 h-8 text-slate-400 dark:text-slate-600 shrink-0 z-10" />

            <div className="text-center z-10 w-full md:w-1/3 p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-blue-900/50 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-purple-500 mb-2">database</span>
                <h3 className="font-bold text-slate-900 dark:text-white">2. Supabase DB</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Stores relationships between Courses, Profiles, and Lessons securely.</p>
            </div>

            <MoveRight className="hidden md:block w-8 h-8 text-slate-400 dark:text-slate-600 shrink-0 z-10" />

            <div className="text-center z-10 w-full md:w-1/3 p-4 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-blue-900/50 shadow-sm">
                <span className="material-symbols-outlined text-4xl text-green-500 mb-2">school</span>
                <h3 className="font-bold text-slate-900 dark:text-white">3. Students</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consume lessons, track progress, and complete chapters.</p>
            </div>
             
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-12 mb-4">
        Step-by-Step Instructions
      </h2>

      <Accordion type="single" collapsible className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-blue-900/50 px-4 shadow-sm">
        
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">add_circle</span>
               1. Creating a New Course
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed pl-10 space-y-4">
            <p>
              Under <strong>Admin Portal &gt; Create Course</strong>, you fill out the overarching details. 
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Title:</strong> Required name of the course.</li>
              <li><strong>Description:</strong> What the students will learn.</li>
              <li><strong>Thumbnail:</strong> An uploaded image visually representing the course.</li>
              <li><strong>Published:</strong> Keep this unchecked (Draft mode) until all lessons are ready.</li>
            </ul>
            <p className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-blue-900/50 text-sm">
               <em>Behind the scenes:</em> This securely inserts a row into the <code className="dark:text-white">public.courses</code> table attached to your unique Instructor ID.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
           <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">format_list_bulleted</span>
               2. Building the Curriculum (Lessons)
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed pl-10 space-y-4">
            <p>
              Once a course is created (or by clicking &quot;Edit&quot; in <strong>All Courses</strong>), you are directed to the Curriculum Setup mode.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click <strong>&quot;Add a Lesson&quot;</strong> to create a new module (e.g., Chapter 1).</li>
              <li>You can drag and drop chapters using the grip icon on the left to reorder them seamlessly.</li>
              <li>Click the <strong>Pencil icon</strong> on any lesson to open its detail page.</li>
            </ul>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs border border-blue-200 dark:border-blue-800">Video Badge</span>
              <p className="text-sm">Appears automatically when you&apos;ve successfully uploaded a video to that lesson.</p>
            </div>
             <p className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-blue-900/50 text-sm">
               <em>Behind the scenes:</em> Lessons are tied to the <code className="dark:text-white">course_id</code>. Dragging them automatically updates their <code className="dark:text-white">position</code> integer in the database.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">video_call</span>
               3. Adding Media & Editing Lessons
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed pl-10 space-y-4">
            <p>
              Inside a lesson&apos;s edit page, you define its payload. Provide text content or drop in a video. 
            </p>
             <ul className="list-disc pl-5 space-y-2">
              <li><strong>Video Upload:</strong> Utilizes <code className="dark:text-white">react-dropzone</code>. Ensure files are mp4/mov. It maps to the <code className="dark:text-white">video_url</code> field.</li>
              <li><strong>Free Preview:</strong> Checking this switch allows unauthenticated or un-enrolled students to view just this specific chapter.</li>
            </ul>
             <p className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-blue-900/50 text-sm">
               <em>Caution:</em> Video uploads depend on your configured storage bucket (e.g., Supabase Storage). Ensure your buckets are set to public if students need direct access without signed URLs.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">palette</span>
               4. Theming and Customization 
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed pl-10 space-y-4">
            <p>
              The platform utilizes standard Tailwind CSS alongside Shadcn UI for beautiful defaults.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Change Primary Colors:</strong> Open <code className="dark:text-white">app/globals.css</code>. Under the <code className="dark:text-white">:root</code> selector, modify the HSL value for <code className="dark:text-white">--primary</code>. It will cascade to all buttons and accents instantly.</li>
              <li><strong>Dark Mode:</strong> The site actively supports <code className="dark:text-white">next-themes</code>. Toggling between light and dark adjusts CSS variables automatically. Edit <code className="dark:text-white">.dark</code> in globals to tweak these.</li>
              <li><strong>Fonts:</strong> Managed globally in <code className="dark:text-white">app/layout.tsx</code> using Next.js optimized Google Fonts.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5 border-none">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-destructive">delete</span>
               5. Editing & Deletion Safeguards
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed pl-10 space-y-4 pb-4">
            <p>
              Because your schema uses <code className="dark:text-white">ON DELETE CASCADE</code> for relationships:
            </p>
             <ul className="list-disc pl-5 space-y-2">
              <li>If you delete a <strong>Course</strong>, all associated <strong>Lessons</strong>, Student Progress, and attachments are automatically deleted from the database.</li>
              <li><strong>Warning:</strong> Currently, there are no &quot;soft deletes.&quot; Therefore, to hide a course securely, utilize the <strong>&quot;Published&quot;</strong> toggle inside Course Settings to revert it to Draft status rather than striking it from the database!</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
