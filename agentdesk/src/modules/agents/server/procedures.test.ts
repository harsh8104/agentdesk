import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbUpdate: vi.fn(),
  dbDelete: vi.fn(),
  dbInsert: vi.fn(),
  dbSelect: vi.fn(),
  dbCount: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    update: mocks.dbUpdate,
    delete: mocks.dbDelete,
    insert: mocks.dbInsert,
    select: mocks.dbSelect,
    $count: mocks.dbCount,
  },
}));

vi.mock("@/db/schema", () => ({
  agents: { id: "agent_id", userId: "agent_user_id", name: "agent_name", createdAt: "created_at" },
  meetings: { agentId: "meeting_agent_id" },
}));

vi.mock("@/trpc/init", async () => {
  const { initTRPC } = await import("@trpc/server");
  const t = initTRPC.create();
  const authed = t.procedure.use(async ({ ctx, next }) =>
    next({
      ctx: {
        ...ctx,
        auth: {
          user: { id: "user_1", name: "User 1", image: null },
        },
      },
    }),
  );

  return {
    createTRPCRouter: t.router,
    protectedProcedure: authed,
    premiumProcedure: () => authed,
  };
});

import { agentsRouter } from "@/modules/agents/server/procedures";

const makeUpdateResult = (rows: unknown[]) => ({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue(rows),
    }),
  }),
});

const makeDeleteResult = (rows: unknown[]) => ({
  where: vi.fn().mockReturnValue({
    returning: vi.fn().mockResolvedValue(rows),
  }),
});

const makeInsertResult = (rows: unknown[]) => ({
  values: vi.fn().mockReturnValue({
    returning: vi.fn().mockResolvedValue(rows),
  }),
});

const makeSelectOne = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(rows),
  }),
});

const makeSelectMany = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      orderBy: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          offset: vi.fn().mockResolvedValue(rows),
        }),
      }),
    }),
  }),
});

describe("agents module major cases", () => {
  const caller = agentsRouter.createCaller({});

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.dbCount.mockReturnValue(3);
  });

  it("creates agent with valid input", async () => {
    mocks.dbInsert.mockReturnValueOnce(makeInsertResult([{ id: "a1", name: "Agent" }]));

    await expect(caller.create({ name: "Agent", instructions: "Help" })).resolves.toEqual({ id: "a1", name: "Agent" });
  });

  it("fails create validation for missing fields", async () => {
    await expect(caller.create({ name: "", instructions: "" })).rejects.toBeTruthy();
  });

  it("updates existing owned agent", async () => {
    mocks.dbUpdate.mockReturnValueOnce(makeUpdateResult([{ id: "a1", name: "Agent updated" }]));

    await expect(caller.update({ id: "a1", name: "Agent updated", instructions: "Help" })).resolves.toEqual({ id: "a1", name: "Agent updated" });
  });

  it("returns not found when update target is missing", async () => {
    mocks.dbUpdate.mockReturnValueOnce(makeUpdateResult([]));

    await expect(caller.update({ id: "a999", name: "Agent", instructions: "Help" })).rejects.toThrow("Agent not found");
  });

  it("deletes existing owned agent", async () => {
    mocks.dbDelete.mockReturnValueOnce(makeDeleteResult([{ id: "a1" }]));

    await expect(caller.remove({ id: "a1" })).resolves.toEqual({ id: "a1" });
  });

  it("returns not found when delete target is missing", async () => {
    mocks.dbDelete.mockReturnValueOnce(makeDeleteResult([]));

    await expect(caller.remove({ id: "a999" })).rejects.toThrow("Agent not found");
  });

  it("gets one owned agent with meeting count", async () => {
    mocks.dbSelect.mockReturnValueOnce(makeSelectOne([{ id: "a1", name: "Agent", meetingCount: 2 }]));

    await expect(caller.getOne({ id: "a1" })).resolves.toEqual({ id: "a1", name: "Agent", meetingCount: 2 });
  });

  it("returns not found for missing agent in getOne", async () => {
    mocks.dbSelect.mockReturnValueOnce(makeSelectOne([]));

    await expect(caller.getOne({ id: "a999" })).rejects.toThrow("Agent not found");
  });

  it("lists agents with pagination shape", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectMany([{ id: "a1", name: "Agent" }]))
      .mockReturnValueOnce(makeSelectOne([{ count: 1 }]));

    await expect(caller.getMany({ page: 1, pageSize: 10, search: null })).resolves.toEqual({
      items: [{ id: "a1", name: "Agent" }],
      total: 1,
      totalPages: 1,
    });
  });

  it("supports search path in list query", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectMany([{ id: "a1", name: "Support Agent" }]))
      .mockReturnValueOnce(makeSelectOne([{ count: 1 }]));

    const result = await caller.getMany({ page: 1, pageSize: 10, search: "Support" });
    expect(result.total).toBe(1);
    expect(result.items[0].name).toContain("Support");
  });
});
