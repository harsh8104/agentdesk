"use client";

import { useRouter } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataPagination } from "@/components/data-pagination";

import { columns } from "../components/columns";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilters();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
    ...filters,
  }));
  
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="rounded-lg border border-blue-200 bg-blue-50/30 backdrop-blur-sm overflow-hidden">
        <DataTable 
          data={data.items} 
          columns={columns} 
          onRowClick={(row) => router.push(`/meetings/${row.id}`)}
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
            src="/Young Man Having Video Call on Laptop at Office.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-60 h-60 rounded-full object-cover border-4 border-blue-200 shadow-lg"
          />
          <div className="flex flex-col gap-y-4 max-w-md mx-auto text-center mt-8">
            <h6 className="text-2xl font-bold text-black">Create your first meeting</h6>
            <p className="text-sm text-gray-600">
              Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a fews econds"
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meetings"
      description="Something went wrong"
    />
  )
}