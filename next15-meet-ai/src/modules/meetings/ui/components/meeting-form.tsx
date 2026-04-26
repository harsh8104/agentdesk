import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, BotIcon, FileTextIcon, ClockIcon, CheckCircle2Icon, PlayCircleIcon } from "lucide-react";

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
        <form className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Meeting Name Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold text-black">Meeting Details</h3>
            </div>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-400">Meeting Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="e.g. Q1 Planning Discussion, Client Onboarding" 
                      className="border-gray-600 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* AI Agent Section */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BotIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-black">AI Agent</h3>
            </div>
            <FormField
              name="agentId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-400">Select Agent</FormLabel>
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
                            <div className="flex-1">
                              <p className="text-sm font-medium">{agent.name}</p>
                            </div>
                          </div>
                        )
                      }))}
                      onSelect={field.onChange}
                      onSearch={setAgentSearch}
                      value={field.value}
                      placeholder="Search and select an agent..."
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Don't have the right agent?{" "}
                    <button
                      type="button"
                      className="text-purple-400 hover:text-purple-300 font-medium"
                      onClick={() => setOpenNewAgentDialog(true)}
                    >
                      Create a new one
                    </button>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Presentation Section */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-semibold text-black">Presentation</h3>
            </div>
            <FormField
              name="presentationId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-400">Attach Presentation (Optional)</FormLabel>
                  <FormControl>
                    <CommandSelect
                      options={(presentationsQuery.data?.items ?? []).map((pres) => ({
                        id: pres.id,
                        value: pres.id,
                        children: (
                          <div className="flex items-center gap-x-2 w-full">
                            <span className="text-lg">📊</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{pres.name}</p>
                              <p className="text-xs text-gray-500">{pres.totalSlides} slides</p>
                            </div>
                          </div>
                        )
                      }))}
                      onSelect={field.onChange}
                      onSearch={setPresentationSearch}
                      value={field.value ?? ""}
                      placeholder="Search presentations..."
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Sync your PowerPoint slides with the AI agent. The agent will reference relevant slides during the meeting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Schedule Section */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-black">When to Start</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={scheduleType === "now" ? "default" : "outline"}
                className={cn(
                  "w-full transition-all",
                  scheduleType === "now" 
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-black"
                    : "border-gray-600 text-gray-700 hover:text-black hover:border-gray-500"
                )}
                onClick={() => {
                  setScheduleType("now");
                  form.setValue("scheduledAt", null);
                }}
              >
                <PlayCircleIcon className="w-4 h-4 mr-2" />
                Start Now
              </Button>
              <Button
                type="button"
                variant={scheduleType === "later" ? "default" : "outline"}
                className={cn(
                  "w-full transition-all",
                  scheduleType === "later"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-black"
                    : "border-gray-600 text-gray-700 hover:text-black hover:border-gray-500"
                )}
                onClick={() => setScheduleType("later")}
              >
                <ClockIcon className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>

          {scheduleType === "later" && (
            <FormField
              name="scheduledAt"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col bg-gradient-to-r from-emerald-500/5 to-green-500/5 border border-emerald-500/30 rounded-lg p-4">
                  <FormLabel className="text-xs text-gray-400 mb-2">Pick Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4 text-emerald-400" />
                          {field.value
                            ? format(new Date(field.value), "PPP 'at' hh:mm a")
                            : "Select date and time"}
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
                      <div className="border-t p-3 bg-slate-900">
                        <FormLabel className="text-xs text-gray-400">Time</FormLabel>
                        <Input
                          type="time"
                          className="mt-2 border-gray-600 focus:border-emerald-400 focus:ring-emerald-400/20"
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
                  <FormDescription className="text-xs text-gray-500 mt-2">
                    A reminder email will be sent 15 minutes before the scheduled time.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-between gap-x-3 pt-4 border-t border-gray-700">
            {onCancel && (
              <Button
                variant="ghost"
                disabled={isPending}
                type="button"
                onClick={() => onCancel()}
                className="text-gray-600 hover:text-black"
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={isPending}
              type="submit"
              className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-black font-medium"
            >
              <CheckCircle2Icon className="w-4 h-4 mr-2" />
              {isEdit ? "Update Meeting" : "Create Meeting"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
