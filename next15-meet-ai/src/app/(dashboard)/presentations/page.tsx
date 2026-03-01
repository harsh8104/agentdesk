import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoaderIcon } from "lucide-react";

import { ErrorState } from "@/components/error-state";

import { PresentationsView } from "@/modules/presentations/ui/views/presentations-view";

export default function PresentationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ErrorBoundary
        fallback={
          <ErrorState
            title="Something went wrong"
            description="Failed to load presentations"
          />
        }
      >
        <PresentationsView />
      </ErrorBoundary>
    </Suspense>
  );
}
