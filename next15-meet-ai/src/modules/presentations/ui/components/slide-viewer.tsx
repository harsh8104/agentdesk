"use client";

import { cn } from "@/lib/utils";

interface Props {
  fileUrl: string | null;
  currentSlide: number;
  totalSlides: number;
  onSlideChange: (slideNumber: number) => void;
}

export const SlideViewer = ({
  fileUrl,
  currentSlide,
  totalSlides,
  onSlideChange,
}: Props) => {
  const handlePrev = () => {
    if (currentSlide > 1) {
      onSlideChange(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      onSlideChange(currentSlide + 1);
    }
  };

  // Build the Google Docs Viewer URL for the PPTX file
  // We need the full public URL for Google Docs Viewer to access the file
  const getViewerUrl = () => {
    if (!fileUrl) return null;

    // Use the app URL (ngrok or production) to build a public URL
    const appUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = `${appUrl}${fileUrl}`;

    // Google Docs Viewer can render PPTX files
    return `https://docs.google.com/gview?url=${encodeURIComponent(publicUrl)}&embedded=true`;
  };

  const viewerUrl = getViewerUrl();

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] rounded-lg overflow-hidden">
      {/* PPT Viewer */}
      <div className="flex-1 min-h-0 relative">
        {viewerUrl ? (
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0"
            title="Presentation Viewer"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <p>No presentation file available</p>
          </div>
        )}
      </div>

      {/* Bottom: Slide indicator + navigation */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#16162a] border-t border-white/10">
        <button
          onClick={handlePrev}
          disabled={currentSlide <= 1}
          className={cn(
            "px-3 py-1 rounded text-sm font-medium transition-colors",
            currentSlide <= 1
              ? "text-gray-600 cursor-not-allowed"
              : "text-white hover:bg-white/10"
          )}
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-300 font-medium">
          Slide {currentSlide} / {totalSlides}
        </span>

        <button
          onClick={handleNext}
          disabled={currentSlide >= totalSlides}
          className={cn(
            "px-3 py-1 rounded text-sm font-medium transition-colors",
            currentSlide >= totalSlides
              ? "text-gray-600 cursor-not-allowed"
              : "text-white hover:bg-white/10"
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
