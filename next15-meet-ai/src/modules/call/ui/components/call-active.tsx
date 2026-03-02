"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CallControls,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { SlideViewer } from "@/modules/presentations/ui/components/slide-viewer";

interface Props {
  onLeave: () => void;
  meetingName: string;
  presentationId?: string;
};

export const CallActive = ({ onLeave, meetingName, presentationId }: Props) => {
  const trpc = useTRPC();
  const [currentSlide, setCurrentSlide] = useState(1);

  // Fetch presentation data if presentationId is provided
  const { data: presentation } = useQuery({
    ...trpc.presentations.getOne.queryOptions({ id: presentationId! }),
    enabled: !!presentationId,
  });

  const handleSlideChange = useCallback((slideNumber: number) => {
    setCurrentSlide(slideNumber);
  }, []);

  // If no presentation, render the original simple layout
  if (!presentationId || !presentation) {
    return (
      <div className="flex flex-col justify-between p-4 h-full text-white">
        <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
          <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
            <Image src="/agentdesk-logo.png" width={22} height={22} alt="AgentDesk" className="rounded-sm" />
          </Link>
          <h4 className="text-base">
            {meetingName}
          </h4>
        </div>
        <SpeakerLayout />
        <div className="bg-[#101213] rounded-full px-4">
          <CallControls onLeave={onLeave} />
        </div>
      </div>
    );
  }

  // Side-by-side layout with presentation
  return (
    <div className="flex flex-col h-full text-white">
      {/* Header bar */}
      <div className="bg-[#101213] rounded-full p-3 m-3 flex items-center gap-4">
        <Link href="/" className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
          <Image src="/agentdesk-logo.png" width={22} height={22} alt="AgentDesk" className="rounded-sm" />
        </Link>
        <h4 className="text-base flex-1">{meetingName}</h4>
        <span className="text-xs text-gray-400 bg-indigo-600/20 text-indigo-300 px-2 py-1 rounded-full">
          📊 {presentation.name} — {presentation.totalSlides} slides
        </span>
      </div>

      {/* Main content: Video + Slides side-by-side */}
      <div className="flex-1 flex gap-3 px-3 min-h-0 overflow-hidden">
        {/* Left: Video */}
        <div className="flex flex-col w-1/3 min-h-0 flex-shrink-0">
          <div className="flex-1 min-h-0 rounded-lg overflow-hidden">
            <SpeakerLayout />
          </div>
        </div>

        {/* Right: Slide Viewer */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <SlideViewer
            slides={presentation.slides}
            currentSlide={currentSlide}
            onSlideChange={handleSlideChange}
          />
        </div>
      </div>

      {/* Bottom: Call Controls */}
      <div className="bg-[#101213] rounded-full px-4 m-3">
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
};
