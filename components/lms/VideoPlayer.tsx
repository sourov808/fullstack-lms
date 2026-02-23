"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center aspect-video w-full bg-slate-800 rounded-md">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center aspect-video w-full bg-slate-800 rounded-md text-slate-200 p-4">
        <p className="text-sm text-center">Failed to load video</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline mt-2"
        >
          Open video in new tab
        </a>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-md overflow-hidden bg-black mb-6 shadow-sm">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}
      <video
        controls
        className="w-full h-full"
        preload="metadata"
        onLoadedData={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Video error:", e);
          setError("Failed to load video");
          setIsLoading(false);
        }}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
