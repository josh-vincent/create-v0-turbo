import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@tocld/api";
import { timeEntries } from "@tocld/db/schema";
import { eq, desc, isNull } from "@tocld/db";
import { createTimeEntrySchema, updateTimeEntrySchema } from "../types";

// Mock data for development
const mockTimeEntries = [
  {
    id: "time_1",
    userId: "00000000-0000-0000-0000-000000000001",
    projectName: "E-commerce Redesign",
    description: "Frontend development - Product page",
    startTime: new Date("2025-01-15T09:00:00Z"),
    endTime: new Date("2025-01-15T12:30:00Z"),
    duration: 210, // 3.5 hours in minutes
    hourlyRate: "150.00",
    billable: true,
    notes: "Completed product grid and filters",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "time_2",
    userId: "00000000-0000-0000-0000-000000000001",
    projectName: "Mobile App Development",
    description: "API integration",
    startTime: new Date("2025-01-16T14:00:00Z"),
    endTime: new Date("2025-01-16T17:00:00Z"),
    duration: 180, // 3 hours
    hourlyRate: "150.00",
    billable: true,
    notes: null,
    createdAt: new Date("2025-01-16"),
    updatedAt: new Date("2025-01-16"),
  },
  {
    id: "time_3",
    userId: "00000000-0000-0000-0000-000000000001",
    projectName: "Internal Tools",
    description: "Dashboard improvements",
    startTime: new Date("2025-01-17T10:00:00Z"),
    endTime: null, // Currently running timer
    duration: null,
    hourlyRate: "0.00",
    billable: false,
    notes: null,
    createdAt: new Date("2025-01-17"),
    updatedAt: new Date("2025-01-17"),
  },
];

export const timeRouter = createTRPCRouter({
  // List all time entries
  list: protectedProcedure
    .input(
      z.object({
        projectName: z.string().optional(),
        billable: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] time.list - Using mock data");
        let filtered = [...mockTimeEntries];

        if (input?.projectName) {
          filtered = filtered.filter(entry => entry.projectName === input.projectName);
        }

        if (input?.billable !== undefined) {
          filtered = filtered.filter(entry => entry.billable === input.billable);
        }

        return filtered.slice(input?.offset || 0, (input?.offset || 0) + (input?.limit || 50));
      }

      // Real implementation
      let query = ctx.db
        .select()
        .from(timeEntries)
        .where(eq(timeEntries.userId, ctx.session!.user.id))
        .orderBy(desc(timeEntries.startTime))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);

      if (input?.projectName) {
        query = query.where(eq(timeEntries.projectName, input.projectName));
      }

      if (input?.billable !== undefined) {
        query = query.where(eq(timeEntries.billable, input.billable));
      }

      return query;
    }),

  // Get single time entry
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] time.getById - Using mock data");
        const entry = mockTimeEntries.find(t => t.id === input.id);
        if (!entry) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Time entry not found",
          });
        }
        return entry;
      }

      // Real implementation
      const [entry] = await ctx.db
        .select()
        .from(timeEntries)
        .where(eq(timeEntries.id, input.id))
        .limit(1);

      if (!entry || entry.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Time entry not found",
        });
      }

      return entry;
    }),

  // Get currently running timer
  getRunning: protectedProcedure.query(async ({ ctx }) => {
    // Mock mode
    if (ctx.isMockMode) {
      console.log("🔶 [MOCK] time.getRunning - Using mock data");
      return mockTimeEntries.find(entry => entry.endTime === null) || null;
    }

    // Real implementation
    const [running] = await ctx.db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.userId, ctx.session!.user.id))
      .where(isNull(timeEntries.endTime))
      .limit(1);

    return running || null;
  }),

  // Start timer
  start: protectedProcedure
    .input(
      z.object({
        projectName: z.string().min(1),
        description: z.string().min(1),
        hourlyRate: z.number().min(0).optional(),
        billable: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if there's already a running timer
      if (ctx.isMockMode) {
        const running = mockTimeEntries.find(entry => entry.endTime === null);
        if (running) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A timer is already running. Stop it before starting a new one.",
          });
        }

        console.log("🔶 [MOCK] time.start - Using mock data");
        const newEntry = {
          id: `time_${Date.now()}`,
          userId: ctx.session!.user.id,
          projectName: input.projectName,
          description: input.description,
          startTime: new Date(),
          endTime: null,
          duration: null,
          hourlyRate: input.hourlyRate?.toString() || null,
          billable: input.billable,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockTimeEntries.push(newEntry);
        return newEntry;
      }

      // Real implementation - check for running timer
      const [running] = await ctx.db
        .select()
        .from(timeEntries)
        .where(eq(timeEntries.userId, ctx.session!.user.id))
        .where(isNull(timeEntries.endTime))
        .limit(1);

      if (running) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A timer is already running. Stop it before starting a new one.",
        });
      }

      const [newEntry] = await ctx.db
        .insert(timeEntries)
        .values({
          userId: ctx.session!.user.id,
          projectName: input.projectName,
          description: input.description,
          startTime: new Date(),
          endTime: null,
          duration: null,
          hourlyRate: input.hourlyRate?.toString(),
          billable: input.billable,
        })
        .returning();

      return newEntry!;
    }),

  // Stop timer
  stop: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] time.stop - Using mock data");
        const index = mockTimeEntries.findIndex(entry => entry.id === input.id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Time entry not found",
          });
        }

        const entry = mockTimeEntries[index]!;
        if (entry.endTime) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Timer is already stopped",
          });
        }

        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000 / 60);

        mockTimeEntries[index] = {
          ...entry,
          endTime,
          duration,
          updatedAt: new Date(),
        };

        return mockTimeEntries[index]!;
      }

      // Real implementation
      const [entry] = await ctx.db
        .select()
        .from(timeEntries)
        .where(eq(timeEntries.id, input.id))
        .limit(1);

      if (!entry || entry.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Time entry not found",
        });
      }

      if (entry.endTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Timer is already stopped",
        });
      }

      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / 1000 / 60);

      const [updated] = await ctx.db
        .update(timeEntries)
        .set({
          endTime,
          duration,
          updatedAt: new Date(),
        })
        .where(eq(timeEntries.id, input.id))
        .returning();

      return updated!;
    }),

  // Create time entry (manual entry)
  create: protectedProcedure
    .input(createTimeEntrySchema)
    .mutation(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] time.create - Using mock data");
        const newEntry = {
          id: `time_${Date.now()}`,
          userId: ctx.session!.user.id,
          ...input,
          startTime: new Date(input.startTime),
          endTime: input.endTime ? new Date(input.endTime) : null,
          hourlyRate: input.hourlyRate?.toString() || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockTimeEntries.push(newEntry);
        return newEntry;
      }

      // Real implementation
      const [newEntry] = await ctx.db
        .insert(timeEntries)
        .values({
          userId: ctx.session!.user.id,
          ...input,
          startTime: new Date(input.startTime),
          endTime: input.endTime ? new Date(input.endTime) : undefined,
          hourlyRate: input.hourlyRate?.toString(),
        })
        .returning();

      return newEntry!;
    }),

  // Update time entry
  update: protectedProcedure
    .input(updateTimeEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] time.update - Using mock data");
        const index = mockTimeEntries.findIndex(entry => entry.id === id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Time entry not found",
          });
        }

        mockTimeEntries[index] = {
          ...mockTimeEntries[index]!,
          ...updateData,
          startTime: updateData.startTime ? new Date(updateData.startTime) : mockTimeEntries[index]!.startTime,
          endTime: updateData.endTime ? new Date(updateData.endTime) : mockTimeEntries[index]!.endTime,
          hourlyRate: updateData.hourlyRate?.toString() || mockTimeEntries[index]!.hourlyRate,
          updatedAt: new Date(),
        };

        return mockTimeEntries[index]!;
      }

      // Real implementation
      const [updated] = await ctx.db
        .update(timeEntries)
        .set({
          ...updateData,
          startTime: updateData.startTime ? new Date(updateData.startTime) : undefined,
          endTime: updateData.endTime ? new Date(updateData.endTime) : undefined,
          hourlyRate: updateData.hourlyRate?.toString(),
          updatedAt: new Date(),
        })
        .where(eq(timeEntries.id, id))
        .returning();

      if (!updated || updated.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Time entry not found",
        });
      }

      return updated;
    }),

  // Delete time entry
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] time.delete - Using mock data");
        const index = mockTimeEntries.findIndex(entry => entry.id === input.id);
        if (index === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Time entry not found",
          });
        }
        mockTimeEntries.splice(index, 1);
        return { success: true };
      }

      // Real implementation
      const [deleted] = await ctx.db
        .delete(timeEntries)
        .where(eq(timeEntries.id, input.id))
        .returning();

      if (!deleted || deleted.userId !== ctx.session!.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Time entry not found",
        });
      }

      return { success: true };
    }),

  // Get time tracking stats
  getStats: protectedProcedure
    .input(
      z.object({
        projectName: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      // Mock mode
      if (ctx.isMockMode) {
        console.log("🔶 [MOCK] time.getStats - Using mock data");
        let filtered = mockTimeEntries.filter(entry => entry.endTime !== null);

        if (input?.projectName) {
          filtered = filtered.filter(entry => entry.projectName === input.projectName);
        }

        const totalMinutes = filtered.reduce((sum, entry) => sum + (entry.duration || 0), 0);
        const totalHours = totalMinutes / 60;
        const billableMinutes = filtered.filter(e => e.billable).reduce((sum, e) => sum + (e.duration || 0), 0);
        const billableHours = billableMinutes / 60;

        const projectTotals = filtered.reduce((acc, entry) => {
          const project = entry.projectName;
          acc[project] = (acc[project] || 0) + (entry.duration || 0);
          return acc;
        }, {} as Record<string, number>);

        return {
          totalEntries: filtered.length,
          totalHours,
          billableHours,
          nonBillableHours: totalHours - billableHours,
          byProject: Object.entries(projectTotals).map(([project, minutes]) => ({
            project,
            hours: minutes / 60,
          })),
        };
      }

      // Real implementation
      let query = ctx.db
        .select()
        .from(timeEntries)
        .where(eq(timeEntries.userId, ctx.session!.user.id))
        .where(isNull(timeEntries.endTime).not());

      if (input?.projectName) {
        query = query.where(eq(timeEntries.projectName, input.projectName));
      }

      const entries = await query;

      const totalMinutes = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
      const totalHours = totalMinutes / 60;
      const billableMinutes = entries.filter(e => e.billable).reduce((sum, e) => sum + (e.duration || 0), 0);
      const billableHours = billableMinutes / 60;

      const projectTotals = entries.reduce((acc, entry) => {
        const project = entry.projectName;
        acc[project] = (acc[project] || 0) + (entry.duration || 0);
        return acc;
      }, {} as Record<string, number>);

      return {
        totalEntries: entries.length,
        totalHours,
        billableHours,
        nonBillableHours: totalHours - billableHours,
        byProject: Object.entries(projectTotals).map(([project, minutes]) => ({
          project,
          hours: minutes / 60,
        })),
      };
    }),
});
