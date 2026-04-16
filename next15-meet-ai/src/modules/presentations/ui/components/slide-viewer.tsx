"use client";

import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SlideData {
  id: string;
  slideNumber: number;
  textContent: string;
  imageUrl: string | null;
}

interface Props {
  slides: SlideData[];
  currentSlide: number;
  onSlideChange: (slideNumber: number) => void;
}

export const SlideViewer = ({ slides, currentSlide, onSlideChange }: Props) => {
  const current = slides.find((s) => s.slideNumber === currentSlide);
  const totalSlides = slides.length;

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

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] rounded-lg overflow-hidden overflow-x-hidden">
      {/* Slide display area */}
      <div className="flex-1 flex items-center justify-center p-4 min-h-0">
        {current ? (
          <div className="w-full h-full flex items-center justify-center">
            {current.imageUrl ? (
              <div className="relative max-w-full max-h-full w-full h-full">
                <Image
                  src={current.imageUrl}
                  alt={`Slide ${current.slideNumber}`}
                  fill
                  className="object-contain rounded-md shadow-lg"
                />
              </div>
            ) : (
              // Render text content as a styled slide card
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 mx-auto aspect-[16/9] flex flex-col justify-center overflow-auto">
                <div className="text-xs text-gray-400 mb-2 font-medium">
                  Slide {current.slideNumber} of {totalSlides}
                </div>
                <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {current.textContent || "No content on this slide"}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No slide selected</p>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#16162a] border-t border-white/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={currentSlide <= 1}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeftIcon className="size-5" />
        </Button>

        <span className="text-sm text-gray-300 font-medium">
          Slide {currentSlide} / {totalSlides}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentSlide >= totalSlides}
          className="text-white hover:bg-white/10"
        >
          <ChevronRightIcon className="size-5" />
        </Button>
      </div>

      {/* Thumbnail strip */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 px-4 py-2 bg-[#12122a]">
          {slides.map((slide) => (
            <button
              key={slide.id}
              onClick={() => onSlideChange(slide.slideNumber)}
              className={cn(
                "flex-shrink-0 w-20 h-12 rounded border-2 text-[10px] p-1 text-left overflow-hidden transition-all",
                currentSlide === slide.slideNumber
                  ? "border-indigo-500 bg-indigo-500/20 text-white"
                  : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30"
              )}
            >
              <span className="line-clamp-2">
                {slide.textContent.slice(0, 50) || `Slide ${slide.slideNumber}`}
              </span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
