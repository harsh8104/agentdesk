"use client";

import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";

import { columns } from "../components/columns";
import { DataPagination } from "../components/data-pagination";
import { useAgentsFilters } from "../../hooks/use-agents-filters";

export const AgentsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
    ...filters,
  }));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="rounded-lg border border-purple-200 bg-purple-50/30 backdrop-blur-sm overflow-hidden">
        <DataTable
          data={data.items}
          columns={columns}
          onRowClick={(row) => router.push(`/agents/${row.id}`)}
        />
      </div>
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <video
            src="/Collaborative Multi-Agent Grid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-60 h-60 rounded-full object-cover border-4 border-purple-200 shadow-lg"
          />
          <div className="flex flex-col gap-y-4 max-w-md mx-auto text-center mt-8">
            <h6 className="text-2xl font-bold text-black">Create your first agent</h6>
            <p className="text-sm text-gray-600">
              Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="This may take a fews econds"
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  )
}