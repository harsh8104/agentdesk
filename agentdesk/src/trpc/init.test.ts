import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  headers: vi.fn(),
  getStateExternal: vi.fn(),
  dbSelect: vi.fn(),
}));

vi.mock("next/headers", () => ({ headers: mocks.headers }));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: mocks.getSession,
    },
  },
}));

vi.mock("@/lib/polar", () => ({
  polarClient: {
    customers: {
      getStateExternal: mocks.getStateExternal,
    },
  },
}));

vi.mock("@/db", () => ({
  db: {
    select: mocks.dbSelect,
  },
}));

vi.mock("@/db/schema", () => ({
  meetings: { id: "meeting_id", userId: "meeting_user_id" },
  agents: { id: "agent_id", userId: "agent_user_id" },
}));

import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";

const makeSelectResult = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(rows),
  }),
});

describe("shared trpc guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(new Headers());
  });

  it("rejects protected routes without session", async () => {
    mocks.getSession.mockResolvedValue(null);

    const router = createTRPCRouter({
      ping: protectedProcedure.query(() => "ok"),
    });

    const caller = router.createCaller({});
    await expect(caller.ping()).rejects.toThrow("Unauthorized");
  });

  it("allows protected routes with session", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "user_1" } });

    const router = createTRPCRouter({
      ping: protectedProcedure.query(() => "ok"),
    });

    const caller = router.createCaller({});
    await expect(caller.ping()).resolves.toBe("ok");
  });

  it("blocks free user at meetings limit", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "user_1" } });
    mocks.getStateExternal.mockResolvedValue({ activeSubscriptions: [] });
    mocks.dbSelect
      .mockImplementationOnce(() => makeSelectResult([{ count: 3 }]))
      .mockImplementationOnce(() => makeSelectResult([{ count: 1 }]));

    const router = createTRPCRouter({
      action: premiumProcedure("meetings").mutation(() => "ok"),
    });

    const caller = router.createCaller({});
    await expect(caller.action()).rejects.toThrow("maximum number of free meetings");
  });

  it("blocks free user at agents limit", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "user_1" } });
    mocks.getStateExternal.mockResolvedValue({ activeSubscriptions: [] });
    mocks.dbSelect
      .mockImplementationOnce(() => makeSelectResult([{ count: 0 }]))
      .mockImplementationOnce(() => makeSelectResult([{ count: 1 }]));

    const router = createTRPCRouter({
      action: premiumProcedure("agents").mutation(() => "ok"),
    });

    const caller = router.createCaller({});
    await expect(caller.action()).rejects.toThrow("maximum number of free agents");
  });

  it("allows subscribed user even above free limits", async () => {
    mocks.getSession.mockResolvedValue({ user: { id: "user_1" } });
    mocks.getStateExternal.mockResolvedValue({ activeSubscriptions: [{ id: "sub_1" }] });
    mocks.dbSelect
      .mockImplementationOnce(() => makeSelectResult([{ count: 9 }]))
      .mockImplementationOnce(() => makeSelectResult([{ count: 9 }]));

    const router = createTRPCRouter({
      action: premiumProcedure("meetings").mutation(() => "ok"),
    });

    const caller = router.createCaller({});
    await expect(caller.action()).resolves.toBe("ok");
  });
});
