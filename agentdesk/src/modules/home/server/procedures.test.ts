import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbSelect: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    select: mocks.dbSelect,
  },
}));

vi.mock("@/db/schema", () => ({
  meetings: {
    id: "meeting_id",
    userId: "meeting_user_id",
    status: "meeting_status",
    createdAt: "meeting_created_at",
    agentId: "meeting_agent_id",
    name: "meeting_name",
  },
  agents: { id: "agent_id", name: "agent_name", userId: "agent_user_id" },
}));

vi.mock("@/trpc/init", async () => {
  const { initTRPC } = await import("@trpc/server");
  const t = initTRPC.create();
  const authed = t.procedure.use(async ({ ctx, next }) =>
    next({
      ctx: {
        ...ctx,
        auth: {
          user: { id: "user_1" },
        },
      },
    }),
  );

  return {
    createTRPCRouter: t.router,
    protectedProcedure: authed,
  };
});

import { dashboardRouter } from "@/modules/home/server/procedures";

const makeSelectWhere = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(rows),
  }),
});

const makeSelectGroup = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      groupBy: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockResolvedValue(rows),
      }),
    }),
  }),
});

const makeSelectGroupLimit = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    innerJoin: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        groupBy: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(rows),
          }),
        }),
      }),
    }),
  }),
});

const makeRecentMeetings = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    innerJoin: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue(rows),
        }),
      }),
    }),
  }),
});

describe("dashboard module major cases", () => {
  const caller = dashboardRouter.createCaller({});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns totals and filtered status buckets", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectWhere([{ count: 10 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 3 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 2 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 4 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 0 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 3 }]))
      .mockReturnValueOnce(makeSelectGroup([{ month: "2026-04", count: 5 }]))
      .mockReturnValueOnce(makeSelectGroupLimit([{ agentName: "Agent A", count: 6 }]))
      .mockReturnValueOnce(makeRecentMeetings([{ id: "m1", name: "Sync", status: "completed" }]));

    const result = await caller.getStats();

    expect(result.totalMeetings).toBe(10);
    expect(result.totalAgents).toBe(3);
    expect(result.meetingsByStatus.find((x) => x.status === "active")).toBeTruthy();
    expect(result.meetingsByStatus.find((x) => x.status === "cancelled")).toBeUndefined();
  });

  it("returns monthly analytics for last months", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 0 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 0 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 0 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 0 }]))
      .mockReturnValueOnce(makeSelectGroup([{ month: "2026-03", count: 1 }, { month: "2026-04", count: 2 }]))
      .mockReturnValueOnce(makeSelectGroupLimit([{ agentName: "Agent A", count: 2 }]))
      .mockReturnValueOnce(makeRecentMeetings([{ id: "m1" }]));

    const result = await caller.getStats();
    expect(result.meetingsByMonth.length).toBe(2);
  });

  it("returns top agents and recent meetings lists", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectWhere([{ count: 5 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 2 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectGroup([{ month: "2026-04", count: 5 }]))
      .mockReturnValueOnce(makeSelectGroupLimit([{ agentName: "Agent A", count: 3 }, { agentName: "Agent B", count: 2 }]))
      .mockReturnValueOnce(makeRecentMeetings([{ id: "m1" }, { id: "m2" }]));

    const result = await caller.getStats();
    expect(result.meetingsByAgent.length).toBe(2);
    expect(result.recentMeetings.length).toBe(2);
  });
});
