"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";

import { CallProvider } from "../components/call-provider";

interface Props {
  meetingId: string;
};

export const CallView = ({
  meetingId
}: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
  const [now, setNow] = useState(() => new Date());

  // Update current time every second so the countdown is live
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (data.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  // Block joining before the scheduled time
  if (data.scheduledAt && new Date(data.scheduledAt) > now) {
    const scheduled = new Date(data.scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <div className="flex flex-col items-center gap-4 text-center text-white max-w-md">
          <div className="bg-white/10 p-4 rounded-full">
            <CalendarIcon className="size-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold">Meeting Scheduled</h2>
          <p className="text-gray-300">
            This meeting is scheduled for
          </p>
          <p className="text-lg font-semibold text-indigo-300">
            {format(scheduled, "EEEE, MMMM d, yyyy 'at' hh:mm a")}
          </p>
          <div className="flex items-center gap-2 mt-2 bg-white/10 rounded-lg px-4 py-3">
            <ClockIcon className="size-5 text-indigo-400" />
            <span className="text-lg font-mono">
              {hours > 0 && `${hours}h `}{minutes}m {seconds}s
            </span>
            <span className="text-sm text-gray-400">remaining</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You&apos;ll be able to join once the scheduled time arrives.
          </p>
        </div>
      </div>
    );
  }

  return <CallProvider meetingId={meetingId} meetingName={data.name} presentationId={data.presentationId ?? undefined} />;
};
