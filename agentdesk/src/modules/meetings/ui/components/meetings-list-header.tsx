"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PlusIcon, XCircleIcon, CalendarIcon, FilterIcon } from "lucide-react";

import { DEFAULT_PAGE } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MAX_FREE_MEETINGS } from "@/modules/premium/constants";

import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilter } from "./meetings-search-filter";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsListHeader = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: freeUsage } = useQuery(
    trpc.premium.getFreeUsage.queryOptions()
  );

  // If freeUsage is null, user is premium (no limit)
  const isFreeLimitReached = freeUsage
    ? freeUsage.meetingCount >= MAX_FREE_MEETINGS
    : false;

  const isAnyFilterModified =
    !!filters.status || !!filters.search || !!filters.agentId;

  const onClearFilters = () => {
    setFilters({
      status: null,
      agentId: "",
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h5 className="font-bold text-xl text-black">My Meetings</h5>
              <p className="text-xs text-gray-600">Manage and organize your video calls</p>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              disabled={isFreeLimitReached}
              title={isFreeLimitReached ? "Upgrade to create more meetings" : undefined}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              New Meeting
            </Button>
            {isFreeLimitReached && (
              <Button variant="outline" size="sm" asChild className="text-blue-600 border-blue-300 hover:bg-blue-50">
                <Link href="/upgrade">Upgrade</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
            <FilterIcon className="w-4 h-4" />
            <span>Filters</span>
          </div>
          <ScrollArea>
            <div className="flex items-center gap-x-2">
              <MeetingsSearchFilter />
              <StatusFilter />
              <AgentIdFilter />
              {isAnyFilterModified && (
                <Button variant="outline" onClick={onClearFilters} className="text-red-600 border-red-300 hover:bg-red-50">
                  <XCircleIcon className="size-4" />
                  Clear Filters
                </Button>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
