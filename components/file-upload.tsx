"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateUploadSignature } from "@/app/actions/cloudinary";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value?: string;
  accept?: Record<string, string[]>;
  endpoint?: "image" | "video";
}

export const FileUpload = ({
  onChange,
  value,
  accept,
  endpoint = "image",
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);
        setProgress(0);

        const folder = endpoint === "video" ? "lms_videos" : "lms_images";
        const { timestamp, signature, apiKey, cloudName } = await generateUploadSignature(folder);

        if (!cloudName || !apiKey) {
          throw new Error("Missing Cloudinary configuration details. Ensure environment variables are set.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", folder);

        const xhr = new XMLHttpRequest();
        // Use auto/upload to let cloudinary handle both raw/video/image safely, or specify explicitly
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
        );

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            setProgress(percentage);
          }
        };

        xhr.onload = () => {
          setIsUploading(false);
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            onChange(response.secure_url);
            toast.success("File uploaded successfully");
          } else {
            console.error("Upload error:", xhr.responseText);
            toast.error("Failed to upload file to Cloudinary");
          }
        };

        xhr.onerror = () => {
          setIsUploading(false);
          toast.error("Network error during upload");
        };

        xhr.send(formData);
      } catch (error) {
        console.error("Upload error:", error);
        setIsUploading(false);
        toast.error("Failed to initiate upload");
      }
    },
    [onChange, endpoint]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: isUploading,
  });

  if (value) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-4 relative overflow-hidden">
        {endpoint === "image" ? (
           <img src={value} alt="Upload" className="object-cover h-full w-full rounded-md" />
        ) : (
          <div className="flex items-center space-x-2">
            <FileIcon className="h-8 w-8 text-primary" />
            <div className="flex flex-col text-sm">
              <span className="font-medium text-blue-500 break-all max-w-[200px] hover:underline cursor-pointer" onClick={() => window.open(value, "_blank")}>
                {value.split("/").pop() || "Video Uploaded"}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => onChange(undefined)}
          className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full shadow-sm hover:opacity-80 transition"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors relative ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25 hover:bg-muted/50"
      } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center text-primary">
          <Loader2 className="h-10 w-10 mb-2 animate-spin" />
          <p className="text-sm font-medium">Uploading... {progress}%</p>
          <div className="w-32 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : (
        <>
          <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Choose a file or drag & drop it here
          </p>
          <p className="text-xs text-slate-500 mt-1">JPEG, PNG, MP4</p>
        </>
      )}
    </div>
  );
};
