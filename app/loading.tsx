import { Loader } from "@/components/lms/Loader";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
      <Loader size="lg" text="Loading..." />
    </div>
  );
}
