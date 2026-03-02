"use client";

import { useState } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { PresentationIcon, TrashIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PptUpload } from "@/modules/presentations/ui/components/ppt-upload";

export const PresentationsView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.presentations.getMany.queryOptions({ pageSize: 50 })
  );

  const removePresentation = useMutation(
    trpc.presentations.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.presentations.getMany.queryOptions({})
        );
        toast.success("Presentation deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleUploadComplete = async () => {
    setShowUpload(false);
    await queryClient.invalidateQueries(
      trpc.presentations.getMany.queryOptions({})
    );
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Presentations</h1>
            <p className="text-sm text-muted-foreground">
              Upload .pptx files to use with AI agents during meetings
            </p>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)}>
            <PresentationIcon className="size-4 mr-2" />
            Upload PPT
          </Button>
        </div>

        {/* Upload area */}
        {showUpload && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Presentation</CardTitle>
              <CardDescription>
                Upload a .pptx file. The AI agent will use slide content during
                calls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PptUpload onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        )}

        {/* Presentations list */}
        {data.items.length === 0 && !showUpload ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4">
                <video
                  src="/Ppt File.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain scale-75"
                />
              </div>
              <h3 className="text-lg font-medium">No presentations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a .pptx file to get started
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <PresentationIcon className="size-4 mr-2" />
                Upload your first PPT
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {data.items.map((pres) => (
              <Card key={pres.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
                      <PresentationIcon className="size-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{pres.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pres.totalSlides} slides • Uploaded{" "}
                        {new Date(pres.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => removePresentation.mutate({ id: pres.id })}
                    disabled={removePresentation.isPending}
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
