import { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type PresentationsGetMany = inferRouterOutputs<AppRouter>["presentations"]["getMany"]["items"];
export type PresentationGetOne = inferRouterOutputs<AppRouter>["presentations"]["getOne"];
