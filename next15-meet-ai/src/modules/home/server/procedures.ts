import { and, count, desc, eq, sql, gte } from "drizzle-orm";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const [totalMeetings] = await db
      .select({ count: count() })
      .from(meetings)
      .where(eq(meetings.userId, userId));

    const [totalAgents] = await db
      .select({ count: count() })
      .from(agents)
      .where(eq(agents.userId, userId));

    const [upcomingMeetings] = await db
      .select({ count: count() })
      .from(meetings)
      .where(and(eq(meetings.userId, userId), eq(meetings.status, "upcoming")));

    const [completedMeetings] = await db
      .select({ count: count() })
      .from(meetings)
      .where(
        and(eq(meetings.userId, userId), eq(meetings.status, "completed"))
      );

    const [activeMeetings] = await db
      .select({ count: count() })
      .from(meetings)
      .where(and(eq(meetings.userId, userId), eq(meetings.status, "active")));

    const [cancelledMeetings] = await db
      .select({ count: count() })
      .from(meetings)
      .where(
        and(eq(meetings.userId, userId), eq(meetings.status, "cancelled"))
      );

    const [processingMeetings] = await db
      .select({ count: count() })
      .from(meetings)
      .where(
        and(eq(meetings.userId, userId), eq(meetings.status, "processing"))
      );

    const meetingsByStatus = [
      { status: "upcoming", count: upcomingMeetings.count },
      { status: "active", count: activeMeetings.count },
      { status: "completed", count: completedMeetings.count },
      { status: "processing", count: processingMeetings.count },
      { status: "cancelled", count: cancelledMeetings.count },
    ].filter((item) => item.count > 0);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const meetingsByMonth = await db
      .select({
        month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${meetings.createdAt}), 'YYYY-MM')`,
        count: count(),
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, userId),
          gte(meetings.createdAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`DATE_TRUNC('month', ${meetings.createdAt})`)
      .orderBy(sql`DATE_TRUNC('month', ${meetings.createdAt})`);

    const meetingsByAgent = await db
      .select({
        agentName: agents.name,
        count: count(),
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(eq(meetings.userId, userId))
      .groupBy(agents.name)
      .orderBy(desc(count()))
      .limit(5);

    const recentMeetings = await db
      .select({
        id: meetings.id,
        name: meetings.name,
        status: meetings.status,
        createdAt: meetings.createdAt,
        agentName: agents.name,
      })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId, agents.id))
      .where(eq(meetings.userId, userId))
      .orderBy(desc(meetings.createdAt))
      .limit(5);

    return {
      totalMeetings: totalMeetings.count,
      totalAgents: totalAgents.count,
      upcomingMeetings: upcomingMeetings.count,
      completedMeetings: completedMeetings.count,
      meetingsByStatus,
      meetingsByMonth,
      meetingsByAgent,
      recentMeetings,
    };
  }),
});
