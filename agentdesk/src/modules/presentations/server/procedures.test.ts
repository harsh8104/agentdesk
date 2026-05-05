import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbSelect: vi.fn(),
  dbDelete: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    select: mocks.dbSelect,
    delete: mocks.dbDelete,
  },
}));

vi.mock("@/db/schema", () => ({
  presentations: { id: "presentation_id", userId: "presentation_user_id", name: "presentation_name", createdAt: "created_at" },
  presentationSlides: { presentationId: "slide_presentation_id", slideNumber: "slide_number" },
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

import { presentationsRouter } from "@/modules/presentations/server/procedures";

const makeSelectWhere = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(rows),
  }),
});

const makeSelectWhereOrder = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      orderBy: vi.fn().mockResolvedValue(rows),
    }),
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

const makeDeleteWhere = (rows: unknown[]) => ({
  where: vi.fn().mockReturnValue({
    returning: vi.fn().mockResolvedValue(rows),
  }),
});

describe("presentations module major cases", () => {
  const caller = presentationsRouter.createCaller({});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets one presentation with ordered slides", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectWhere([{ id: "p1", name: "Deck" }]))
      .mockReturnValueOnce(makeSelectWhereOrder([{ slideNumber: 1, textContent: "Intro" }]));

    await expect(caller.getOne({ id: "p1" })).resolves.toEqual({
      id: "p1",
      name: "Deck",
      slides: [{ slideNumber: 1, textContent: "Intro" }],
    });
  });

  it("returns not found for missing presentation", async () => {
    mocks.dbSelect.mockReturnValueOnce(makeSelectWhere([]));

    await expect(caller.getOne({ id: "p404" })).rejects.toThrow("Presentation not found");
  });

  it("lists presentations with pagination", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectMany([{ id: "p1", name: "Deck" }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]));

    const result = await caller.getMany({ page: 1, pageSize: 10, search: null });
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("applies search path in list", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectMany([{ id: "p1", name: "Sales Deck" }]))
      .mockReturnValueOnce(makeSelectWhere([{ count: 1 }]));

    const result = await caller.getMany({ page: 1, pageSize: 10, search: "Sales" });
    expect(result.items[0].name).toContain("Sales");
  });

  it("removes owned presentation", async () => {
    mocks.dbDelete.mockReturnValueOnce(makeDeleteWhere([{ id: "p1" }]));

    await expect(caller.remove({ id: "p1" })).resolves.toEqual({ id: "p1" });
  });

  it("returns not found when remove target is missing", async () => {
    mocks.dbDelete.mockReturnValueOnce(makeDeleteWhere([]));

    await expect(caller.remove({ id: "p404" })).rejects.toThrow("Presentation not found");
  });
});
