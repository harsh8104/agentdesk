"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PlusIcon, XCircleIcon } from "lucide-react";

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
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <div className="flex items-center gap-x-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              disabled={isFreeLimitReached}
              title={isFreeLimitReached ? "Upgrade to create more meetings" : undefined}
            >
              <PlusIcon />
              New Meeting
            </Button>
            {isFreeLimitReached && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/upgrade">Upgrade</Link>
              </Button>
            )}
          </div>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button variant="outline" onClick={onClearFilters}>
                <XCircleIcon className="size-4" />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
