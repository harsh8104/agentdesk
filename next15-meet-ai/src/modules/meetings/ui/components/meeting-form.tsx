import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { MeetingGetOne } from "../../types";
import { meetingsInsertSchema } from "../../schemas";

import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useRouter } from "next/navigation";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
};

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [presentationSearch, setPresentationSearch] = useState("");
  const [scheduleType, setScheduleType] = useState<"now" | "later">(
    initialValues?.scheduledAt ? "later" : "now"
  );

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const presentationsQuery = useQuery(
    trpc.presentations.getMany.queryOptions({
      pageSize: 100,
      search: presentationSearch,
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions(),
        );

        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    }),
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
      scheduledAt: initialValues?.scheduledAt ? new Date(initialValues.scheduledAt) : undefined,
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    const submitValues = {
      ...values,
      scheduledAt: scheduleType === "now" ? null : values.scheduledAt,
    };

    if (isEdit) {
      updateMeeting.mutate({ ...submitValues, id: initialValues.id });
    } else {
      createMeeting.mutate(submitValues);
    }
  };

  return (
    <>
      <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math Consultations" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      )
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="presentationId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Presentation (Optional)</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(presentationsQuery.data?.items ?? []).map((pres) => ({
                      id: pres.id,
                      value: pres.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <span>📊</span>
                          <span>{pres.name} ({pres.totalSlides} slides)</span>
                        </div>
                      )
                    }))}
                    onSelect={field.onChange}
                    onSearch={setPresentationSearch}
                    value={field.value ?? ""}
                    placeholder="Select a presentation"
                  />
                </FormControl>
                <FormDescription>
                  Link a PPT to sync slides with the AI agent during the call.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Schedule Options */}
          <FormItem>
            <FormLabel>When to start</FormLabel>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={scheduleType === "now" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => {
                  setScheduleType("now");
                  form.setValue("scheduledAt", null);
                }}
              >
                Start Immediately
              </Button>
              <Button
                type="button"
                variant={scheduleType === "later" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setScheduleType("later")}
              >
                Schedule for Later
              </Button>
            </div>
          </FormItem>

          {scheduleType === "later" && (
            <FormField
              name="scheduledAt"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? format(new Date(field.value), "PPP 'at' hh:mm a")
                            : "Pick a date and time"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (!date) return;
                          const existing = field.value ? new Date(field.value) : new Date();
                          date.setHours(existing.getHours(), existing.getMinutes());
                          field.onChange(date);
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                      <div className="border-t p-3">
                        <FormLabel className="text-xs">Time</FormLabel>
                        <Input
                          type="time"
                          className="mt-1"
                          value={
                            field.value
                              ? format(new Date(field.value), "HH:mm")
                              : ""
                          }
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":").map(Number);
                            const date = field.value ? new Date(field.value) : new Date();
                            date.setHours(hours, minutes);
                            field.onChange(date);
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The meeting will be scheduled for this date and time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit">
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
