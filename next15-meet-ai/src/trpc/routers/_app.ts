import { agentsRouter } from '@/modules/agents/server/procedures';
import { dashboardRouter } from '@/modules/home/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';
import { presentationsRouter } from '@/modules/presentations/server/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  dashboard: dashboardRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,
  presentations: presentationsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

