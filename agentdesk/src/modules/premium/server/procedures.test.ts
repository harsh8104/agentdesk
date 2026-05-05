import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbSelect: vi.fn(),
  getStateExternal: vi.fn(),
  productGet: vi.fn(),
  productsList: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    select: mocks.dbSelect,
  },
}));

vi.mock("@/lib/polar", () => ({
  polarClient: {
    customers: {
      getStateExternal: mocks.getStateExternal,
    },
    products: {
      get: mocks.productGet,
      list: mocks.productsList,
    },
  },
}));

vi.mock("@/db/schema", () => ({
  meetings: { id: "meeting_id", userId: "meeting_user_id" },
  agents: { id: "agent_id", userId: "agent_user_id" },
  presentations: { id: "presentation_id", userId: "presentation_user_id" },
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

import { premiumRouter } from "@/modules/premium/server/procedures";

const makeSelectWhere = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(rows),
  }),
});

describe("premium module major cases", () => {
  const caller = premiumRouter.createCaller({});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null current subscription for free user", async () => {
    mocks.getStateExternal.mockResolvedValue({ activeSubscriptions: [] });

    await expect(caller.getCurrentSubscription()).resolves.toBeNull();
  });

  it("returns product when active subscription exists", async () => {
    mocks.getStateExternal.mockResolvedValue({ activeSubscriptions: [{ productId: "prod_1" }] });
    mocks.productGet.mockResolvedValue({ id: "prod_1", name: "Pro" });

    await expect(caller.getCurrentSubscription()).resolves.toEqual({ id: "prod_1", name: "Pro" });
  });

  it("returns products list", async () => {
    mocks.productsList.mockResolvedValue({ result: { items: [{ id: "prod_1" }] } });

    await expect(caller.getProducts()).resolves.toEqual([{ id: "prod_1" }]);
  });

  it("returns free usage counts for free user", async () => {
    mocks.getStateExternal.mockResolvedValue({ activeSubscriptions: [] });
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectWhere([{ count: 2 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]));

    await expect(caller.getFreeUsage()).resolves.toEqual({
      meetingCount: 2,
      agentCount: 1,
      presentationCount: 1,
    });
  });

  it("returns null free usage for subscribed user", async () => {
    mocks.getStateExternal.mockResolvedValue({ activeSubscriptions: [{ id: "sub_1" }] });

    await expect(caller.getFreeUsage()).resolves.toBeNull();
  });
});
