"use client";

import { useState, useRef } from "react";
import { UploadIcon, LoaderIcon, CheckCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  onUploadComplete: (presentation: {
    id: string;
    name: string;
    totalSlides: number;
  }) => void;
}

export const PptUpload = ({ onUploadComplete }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [name, setName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".pptx")) {
      toast.error("Only .pptx files are supported");
      return;
    }

    setIsUploading(true);
    setUploadedFile(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name || file.name.replace(".pptx", ""));

      const response = await fetch("/api/presentations/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      toast.success(`Parsed ${result.totalSlides} slides successfully!`);
      onUploadComplete(result);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Presentation name (optional)"
        className="w-full"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
            : "border-gray-300 dark:border-gray-600 hover:border-indigo-400",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pptx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <LoaderIcon className="size-8 animate-spin text-indigo-500" />
            <p className="text-sm text-gray-500">Parsing {uploadedFile}...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircleIcon className="size-8 text-green-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {uploadedFile} uploaded!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadIcon className="size-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag & drop a <strong>.pptx</strong> file here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              The file will be parsed and slides extracted automatically
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
