"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PlusIcon, XCircleIcon, BotIcon, FilterIcon } from "lucide-react";

import { DEFAULT_PAGE } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MAX_FREE_AGENTS } from "@/modules/premium/constants";

import { NewAgentDialog } from "./new-agent-dialog";
import { AgentsSearchFilter } from "./agents-search-filter";
import { useAgentsFilters } from "../../hooks/use-agents-filters";

export const AgentsListHeader = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: freeUsage } = useQuery(
    trpc.premium.getFreeUsage.queryOptions()
  );

  // If freeUsage is null, user is premium (no limit)
  const isFreeLimitReached = freeUsage
    ? freeUsage.agentCount >= MAX_FREE_AGENTS
    : false;

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  }

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <BotIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h5 className="font-bold text-xl text-black">My Agents</h5>
              <p className="text-xs text-gray-600">Create and manage your AI agents</p>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              disabled={isFreeLimitReached}
              title={isFreeLimitReached ? "Upgrade to create more agents" : undefined}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              New Agent
            </Button>
            {isFreeLimitReached && (
              <Button variant="outline" size="sm" asChild className="text-purple-600 border-purple-300 hover:bg-purple-50">
                <Link href="/upgrade">Upgrade</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
            <FilterIcon className="w-4 h-4" />
            <span>Search</span>
          </div>
          <ScrollArea>
            <div className="flex items-center gap-x-2">
              <AgentsSearchFilter />
              {isAnyFilterModified && (
                <Button variant="outline" onClick={onClearFilters} className="text-red-600 border-red-300 hover:bg-red-50">
                  <XCircleIcon className="w-4 h-4" />
                  Clear
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
