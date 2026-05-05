"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  referencedSlide?: number;
}

interface Props {
  onSendMessage: (message: string) => void;
  messages: ChatMessage[];
  onJumpToSlide: (slideNumber: number) => void;
  isLoading?: boolean;
}

/**
 * Parse `[SLIDE:N]` markers from AI text and extract slide references.
 */
export function parseSlideMarkers(text: string): {
  cleanText: string;
  slideNumbers: number[];
} {
  const markers: number[] = [];
  const cleanText = text.replace(/\[SLIDE:(\d+)\]/g, (_match, num) => {
    markers.push(parseInt(num, 10));
    return "";
  });

  return {
    cleanText: cleanText.trim(),
    slideNumbers: markers,
  };
}

export const PresentationChat = ({
  onSendMessage,
  messages,
  onJumpToSlide,
  isLoading,
}: Props) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a2e] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-[#16162a]">
        <h6 className="text-sm font-medium text-white">Q&A Chat</h6>
        <p className="text-xs text-gray-400">
          Ask questions and the AI will jump to the relevant slide
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div ref={scrollRef} className="p-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-500 text-xs text-center py-8">
              The AI agent will explain slides here. Ask any question to jump to
              the relevant slide!
            </p>
          )}
          {messages.map((msg) => {
            const { cleanText, slideNumbers } =
              msg.role === "assistant"
                ? parseSlideMarkers(msg.content)
                : { cleanText: msg.content, slideNumbers: [] };

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-1",
                  msg.role === "user" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm max-w-[85%]",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white/10 text-gray-200"
                  )}
                >
                  <p className="whitespace-pre-wrap">{cleanText}</p>
                </div>

                {/* Slide jump buttons */}
                {slideNumbers.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {slideNumbers.map((num) => (
                      <Button
                        key={num}
                        variant="ghost"
                        size="sm"
                        className="text-indigo-400 hover:text-indigo-300 text-xs h-6 px-2"
                        onClick={() => onJumpToSlide(num)}
                      >
                        <ArrowRightIcon className="size-3 mr-1" />
                        Slide {num}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 border-t border-white/10 bg-[#16162a]"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about any slide..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-sm"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <SendIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
};
