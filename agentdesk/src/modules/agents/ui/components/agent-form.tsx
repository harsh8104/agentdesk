import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SparklesIcon, ZapIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

import { AgentGetOne } from "../../types";
import { agentsInsertSchema } from "../../schemas";
import { useRouter } from "next/navigation";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
};

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions(),
        );

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    }),
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({ ...values, id: initialValues.id });
    } else {
      createAgent.mutate(values);
    }
  };

  const agentName = form.watch("name");

  return (
    <Form {...form}>
      <form className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Avatar Section */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg">
          <GeneratedAvatar
            seed={agentName}
            variant="botttsNeutral"
            className="border-2 border-indigo-400/30 size-20 shadow-md"
          />
          <div>
            <p className="text-sm font-medium text-gray-400">AI Agent Avatar</p>
            <p className="text-xs text-gray-500 mt-1">Updates as you change the name</p>
          </div>
        </div>

        {/* Name Field */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-indigo-400" />
                <FormLabel className="text-base font-semibold">Agent Name</FormLabel>
              </div>
              <FormDescription className="text-xs text-gray-500">
                Give your AI agent a unique and memorable name
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Math Tutor, Sales Assistant, Customer Support Bot"
                  className="mt-2 border-gray-600 focus:border-indigo-400 focus:ring-indigo-400/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instructions Field */}
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <ZapIcon className="w-5 h-5 text-amber-400" />
                <FormLabel className="text-base font-semibold">Instructions</FormLabel>
              </div>
              <FormDescription className="text-xs text-gray-500">
                Define how your AI agent should behave and respond to users
              </FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Example: You are a friendly and knowledgeable math tutor. You help students understand concepts, solve problems step-by-step, and encourage learning. Always be patient and provide clear explanations."
                  className="mt-2 min-h-36 border-gray-600 focus:border-indigo-400 focus:ring-indigo-400/20 resize-none"
                />
              </FormControl>
              <div className="mt-2 text-xs text-gray-500">
                <p className="font-medium text-gray-400">Tips:</p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                  <li>Be specific about the agent's role and personality</li>
                  <li>Include guidelines for how to handle edge cases</li>
                  <li>Define the tone and communication style</li>
                </ul>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
            {isEdit ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
