import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@tocld/db";
import { type NewTask, tasks } from "@tocld/db/schema";

import {
  addMockTask,
  deleteMockTask,
  getAllMockTasks,
  getMockTaskById,
  logMockUsage,
} from "../mock-data";
import { protectedProcedure, publicProcedure } from "../trpc";

export const taskRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    // Use mock data if in mock mode
    if (ctx.isMockMode) {
      logMockUsage("task", "all");
      return getAllMockTasks().sort().reverse();
    }

    // Query database (guaranteed to be available here)
    if (!ctx.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not initialized",
      });
    }

    try {
      const dbTasks = await ctx.db.query.tasks.findMany({
        orderBy: desc(tasks.createdAt),
        limit: 10,
      });
      return dbTasks ?? [];
    } catch (error) {
      console.error("❌ [TRPC] Database query failed:", error);
      // Fallback to mock data on error
      logMockUsage("task", "all");
      return getAllMockTasks();
    }
  }),

  byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    // Use mock data if in mock mode
    if (ctx.isMockMode) {
      logMockUsage("task", "byId");
      return getMockTaskById(input.id);
    }

    if (!ctx.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not initialized",
      });
    }

    return ctx.db.query.tasks.findFirst({
      where: eq(tasks.id, input.id),
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use in-memory store in mock mode
      if (ctx.isMockMode) {
        logMockUsage("task", "create");
        const newTask: any = {
          id: crypto.randomUUID(),
          teamId: input.teamId,
          assigneeId: null,
          createdById: ctx.session.user.id,
          title: input.title,
          description: input.description ?? "",
          status: "todo" as const,
          priority: input.priority,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
        };
        addMockTask(newTask);
        return [newTask];
      }

      if (!ctx.db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not initialized",
        });
      }

      const newTask: NewTask = {
        ...input,
        createdById: ctx.session.user.id,
      };

      return ctx.db.insert(tasks).values(newTask).returning();
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    // Use in-memory store in mock mode
    if (ctx.isMockMode) {
      logMockUsage("task", "delete");
      const success = deleteMockTask(input);
      if (!success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }
      return null;
    }

    if (!ctx.db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not initialized",
      });
    }

    return ctx.db.delete(tasks).where(eq(tasks.id, input));
  }),
} satisfies TRPCRouterRecord;
