import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbInsert: vi.fn(),
  dbSelect: vi.fn(),
  dbUpdate: vi.fn(),
  dbDelete: vi.fn(),
  streamVideoCall: vi.fn(),
  callCreate: vi.fn(),
  upsertUsers: vi.fn(),
  generateUserToken: vi.fn(),
  chatCreateToken: vi.fn(),
  chatUpsertUser: vi.fn(),
  inngestSend: vi.fn(),
  avatar: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    insert: mocks.dbInsert,
    select: mocks.dbSelect,
    update: mocks.dbUpdate,
    delete: mocks.dbDelete,
  },
}));

vi.mock("@/db/schema", () => ({
  meetings: {
    id: "meeting_id",
    userId: "meeting_user_id",
    agentId: "meeting_agent_id",
    name: "meeting_name",
    createdAt: "meeting_created_at",
    status: "meeting_status",
  },
  agents: { id: "agent_id", name: "agent_name" },
  user: { id: "user_id", name: "user_name", image: "user_image" },
}));

vi.mock("@/trpc/init", async () => {
  const { initTRPC } = await import("@trpc/server");
  const t = initTRPC.create();
  const authed = t.procedure.use(async ({ ctx, next }) =>
    next({
      ctx: {
        ...ctx,
        auth: {
          user: { id: "user_1", name: "Test User", image: null },
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

vi.mock("@/lib/avatar", () => ({
  generateAvatarUri: mocks.avatar,
}));

vi.mock("@/lib/stream-video", () => ({
  streamVideo: {
    video: {
      call: mocks.streamVideoCall,
    },
    upsertUsers: mocks.upsertUsers,
    generateUserToken: mocks.generateUserToken,
  },
}));

vi.mock("@/lib/stream-chat", () => ({
  streamChat: {
    createToken: mocks.chatCreateToken,
    upsertUser: mocks.chatUpsertUser,
  },
}));

vi.mock("@/inngest/client", () => ({
  inngest: {
    send: mocks.inngestSend,
  },
}));

import { meetingsRouter } from "@/modules/meetings/server/procedures";

const makeInsertResult = (rows: unknown[]) => ({
  values: vi.fn().mockReturnValue({
    returning: vi.fn().mockResolvedValue(rows),
  }),
});

const makeSelectResult = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(rows),
  }),
});

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

const makeSelectManyResult = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    innerJoin: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockResolvedValue(rows),
          }),
        }),
      }),
    }),
  }),
});

const makeSelectOneJoinResult = (rows: unknown[]) => ({
  from: vi.fn().mockReturnValue({
    innerJoin: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(rows),
    }),
  }),
});

describe("meetings module major cases", () => {
  const caller = meetingsRouter.createCaller({});

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.avatar.mockReturnValue("https://avatar.test");
    mocks.chatCreateToken.mockReturnValue("chat-token");
    mocks.generateUserToken.mockReturnValue("video-token");
    mocks.streamVideoCall.mockReturnValue({ create: mocks.callCreate });

    vi.stubGlobal("fetch", vi.fn());
  });

  it("creates a meeting with valid payload", async () => {
    mocks.dbInsert.mockReturnValueOnce(
      makeInsertResult([{ id: "m1", name: "Sync", agentId: "a1", scheduledAt: null }]),
    );
    mocks.dbSelect.mockReturnValueOnce(makeSelectResult([{ id: "a1", name: "Agent A" }]));

    await expect(
      caller.create({ name: "Sync", agentId: "a1", presentationId: null, scheduledAt: null }),
    ).resolves.toMatchObject({ id: "m1", name: "Sync" });
  });

  it("fails create validation for missing required fields", async () => {
    await expect(caller.create({ name: "", agentId: "", scheduledAt: null, presentationId: null })).rejects.toBeTruthy();
  });

  it("returns not found when selected agent is missing during create", async () => {
    mocks.dbInsert.mockReturnValueOnce(
      makeInsertResult([{ id: "m1", name: "Sync", agentId: "a404", scheduledAt: null }]),
    );
    mocks.dbSelect.mockReturnValueOnce(makeSelectResult([]));

    await expect(
      caller.create({ name: "Sync", agentId: "a404", presentationId: null, scheduledAt: null }),
    ).rejects.toThrow("Agent not found");
  });

  it("sends reminder event when meeting is scheduled", async () => {
    const scheduledAt = new Date("2026-04-16T10:00:00.000Z");
    mocks.dbInsert.mockReturnValueOnce(
      makeInsertResult([{ id: "m1", name: "Sync", agentId: "a1", scheduledAt }]),
    );
    mocks.dbSelect.mockReturnValueOnce(makeSelectResult([{ id: "a1", name: "Agent A" }]));

    await caller.create({ name: "Sync", agentId: "a1", presentationId: null, scheduledAt });

    expect(mocks.inngestSend).toHaveBeenCalledTimes(1);
  });

  it("updates owned meeting", async () => {
    mocks.dbUpdate.mockReturnValueOnce(makeUpdateResult([{ id: "m1", name: "Updated" }]));

    await expect(
      caller.update({ id: "m1", name: "Updated", agentId: "a1", presentationId: null, scheduledAt: null }),
    ).resolves.toEqual({ id: "m1", name: "Updated" });
  });

  it("returns not found on update when meeting is missing", async () => {
    mocks.dbUpdate.mockReturnValueOnce(makeUpdateResult([]));

    await expect(
      caller.update({ id: "m404", name: "Updated", agentId: "a1", presentationId: null, scheduledAt: null }),
    ).rejects.toThrow("Meeting not found");
  });

  it("deletes owned meeting", async () => {
    mocks.dbDelete.mockReturnValueOnce(makeDeleteResult([{ id: "m1" }]));

    await expect(caller.remove({ id: "m1" })).resolves.toEqual({ id: "m1" });
  });

  it("returns not found on delete when meeting is missing", async () => {
    mocks.dbDelete.mockReturnValueOnce(makeDeleteResult([]));

    await expect(caller.remove({ id: "m404" })).rejects.toThrow("Meeting not found");
  });

  it("gets one meeting with joined agent and duration", async () => {
    mocks.dbSelect.mockReturnValueOnce(
      makeSelectOneJoinResult([{ id: "m1", name: "Sync", agent: { id: "a1" }, duration: 120 }]),
    );

    await expect(caller.getOne({ id: "m1" })).resolves.toMatchObject({ id: "m1", duration: 120 });
  });

  it("returns not found when getOne target is missing", async () => {
    mocks.dbSelect.mockReturnValueOnce(makeSelectOneJoinResult([]));

    await expect(caller.getOne({ id: "m404" })).rejects.toThrow("Meeting not found");
  });

  it("lists meetings with pagination", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectManyResult([{ id: "m1", status: "upcoming" }]))
      .mockReturnValueOnce(makeSelectOneJoinResult([{ count: 1 }]));

    const result = await caller.getMany({ page: 1, pageSize: 10, search: null, status: null, agentId: null });
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it("generates chat token and upserts chat user", async () => {
    await expect(caller.generateChatToken()).resolves.toBe("chat-token");
    expect(mocks.chatUpsertUser).toHaveBeenCalledTimes(1);
  });

  it("generates video token", async () => {
    await expect(caller.generateToken()).resolves.toBe("video-token");
    expect(mocks.upsertUsers).toHaveBeenCalledTimes(1);
  });

  it("returns empty transcript when transcript URL is missing", async () => {
    mocks.dbSelect.mockReturnValueOnce(makeSelectResult([{ id: "m1", transcriptUrl: null }]));

    await expect(caller.getTranscript({ id: "m1" })).resolves.toEqual([]);
  });

  it("returns empty transcript when transcript fetch fails", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectResult([{ id: "m1", transcriptUrl: "https://bad" }]))
      .mockReturnValueOnce(makeSelectResult([]))
      .mockReturnValueOnce(makeSelectResult([]));
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network error"));

    await expect(caller.getTranscript({ id: "m1" })).resolves.toEqual([]);
  });

  it("maps unknown speaker to fallback user in transcript", async () => {
    mocks.dbSelect
      .mockReturnValueOnce(makeSelectResult([{ id: "m1", transcriptUrl: "https://ok" }]))
      .mockReturnValueOnce(makeSelectResult([]))
      .mockReturnValueOnce(makeSelectResult([]));

    vi.mocked(fetch).mockResolvedValueOnce({
      text: async () => '{"speaker_id":"unknown_speaker","type":"text","text":"Hello","start_ts":0,"stop_ts":1}',
    } as Response);

    const result = await caller.getTranscript({ id: "m1" });
    expect(result[0]?.user?.name).toBe("Unknown");
  });
});
