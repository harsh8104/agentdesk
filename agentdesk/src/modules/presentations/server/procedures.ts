import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";

import { db } from "@/db";
import { presentations, presentationSlides } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const presentationsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [existingPresentation] = await db
        .select()
        .from(presentations)
        .where(
          and(
            eq(presentations.id, input.id),
            eq(presentations.userId, ctx.auth.user.id),
          )
        );

      if (!existingPresentation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Presentation not found" });
      }

      const slides = await db
        .select()
        .from(presentationSlides)
        .where(eq(presentationSlides.presentationId, existingPresentation.id))
        .orderBy(presentationSlides.slideNumber);

      return {
        ...existingPresentation,
        slides,
      };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;

      const data = await db
        .select({
          ...getTableColumns(presentations),
        })
        .from(presentations)
        .where(
          and(
            eq(presentations.userId, ctx.auth.user.id),
            search ? ilike(presentations.name, `%${search}%`) : undefined,
          )
        )
        .orderBy(desc(presentations.createdAt), desc(presentations.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(presentations)
        .where(
          and(
            eq(presentations.userId, ctx.auth.user.id),
            search ? ilike(presentations.name, `%${search}%`) : undefined,
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedPresentation] = await db
        .delete(presentations)
        .where(
          and(
            eq(presentations.id, input.id),
            eq(presentations.userId, ctx.auth.user.id),
          ),
        )
        .returning();

      if (!removedPresentation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Presentation not found",
        });
      }

      return removedPresentation;
    }),
});
