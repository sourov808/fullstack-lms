"use client";

import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  url: string;
}

export const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isMounted, setIsMounted] = useState(false);

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

  return (
    <div className="relative aspect-video w-full rounded-md overflow-hidden bg-black mb-6 shadow-sm">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  );
};
