import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as schema from "@tocld/db/schema";
import { logMockUsage } from "../mock-data";
import { TRPCError } from "@trpc/server";

// Mock data for team management
const mockTeams = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Personal Workspace",
    slug: "personal",
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockTeamMembers = [
  {
    id: "20000000-0000-4000-8000-000000000002",
    teamId: "10000000-0000-4000-8000-000000000001",
    profileId: "00000000-0000-4000-8000-000000000001",
    role: "owner" as const,
    createdAt: new Date(),
  },
];

// Validation schemas
export const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
});

export const updateTeamSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const inviteMemberSchema = z.object({
  teamId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member"]),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["owner", "admin", "member"]),
});

export const teamRouter = createTRPCRouter({
  // List all teams for current user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.isMockMode) {
      logMockUsage("team", "list");
      return mockTeams;
    }

    const members = await ctx.db.query.teamMembers.findMany({
      where: eq(schema.teamMembers.profileId, ctx.session.user.id),
      with: {
        team: true,
      },
    });

    return members.map((m) => m.team);
  }),

  // Get team by ID with members
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("team", "get");
        const team = mockTeams.find((t) => t.id === input.id);
        if (!team) throw new TRPCError({ code: "NOT_FOUND" });
        return {
          ...team,
          members: mockTeamMembers.map((m) => ({
            ...m,
            profile: {
              id: "00000000-0000-4000-8000-000000000001",
              userId: "00000000-0000-4000-8000-000000000001",
              email: "mock@example.com",
              fullName: "Mock User",
              avatarUrl: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })),
        };
      }

      const team = await ctx.db.query.teams.findFirst({
        where: eq(schema.teams.id, input.id),
        with: {
          members: {
            with: {
              profile: true,
            },
          },
        },
      });

      if (!team) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Verify user is a member
      const isMember = team.members.some(
        (m) => m.profileId === ctx.session.user.id
      );
      if (!isMember) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return team;
    }),

  // Create new team
  create: protectedProcedure
    .input(createTeamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("team", "create");
        const newTeam = {
          id: `team_mock_${Date.now()}`,
          ...input,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockTeams.push(newTeam);
        return newTeam;
      }

      const [team] = await ctx.db
        .insert(schema.teams)
        .values(input)
        .returning();

      // Add creator as owner
      await ctx.db.insert(schema.teamMembers).values({
        teamId: team!.id,
        profileId: ctx.session.user.id,
        role: "owner",
      });

      return team;
    }),

  // Update team
  update: protectedProcedure
    .input(updateTeamSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("team", "update");
        const team = mockTeams.find((t) => t.id === input.id);
        if (!team) throw new TRPCError({ code: "NOT_FOUND" });
        Object.assign(team, input, { updatedAt: new Date() });
        return team;
      }

      // Verify user is owner or admin
      const member = await ctx.db.query.teamMembers.findFirst({
        where: and(
          eq(schema.teamMembers.teamId, input.id),
          eq(schema.teamMembers.profileId, ctx.session.user.id)
        ),
      });

      if (!member || (member.role !== "owner" && member.role !== "admin")) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [updated] = await ctx.db
        .update(schema.teams)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(schema.teams.id, input.id))
        .returning();

      return updated;
    }),

  // Delete team
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("team", "delete");
        const index = mockTeams.findIndex((t) => t.id === input.id);
        if (index === -1) throw new TRPCError({ code: "NOT_FOUND" });
        mockTeams.splice(index, 1);
        return { success: true };
      }

      // Verify user is owner
      const member = await ctx.db.query.teamMembers.findFirst({
        where: and(
          eq(schema.teamMembers.teamId, input.id),
          eq(schema.teamMembers.profileId, ctx.session.user.id)
        ),
      });

      if (!member || member.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db.delete(schema.teams).where(eq(schema.teams.id, input.id));

      return { success: true };
    }),

  // Remove member
  removeMember: protectedProcedure
    .input(z.object({ memberId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("team", "removeMember");
        const index = mockTeamMembers.findIndex((m) => m.id === input.memberId);
        if (index === -1) throw new TRPCError({ code: "NOT_FOUND" });
        mockTeamMembers.splice(index, 1);
        return { success: true };
      }

      const member = await ctx.db.query.teamMembers.findFirst({
        where: eq(schema.teamMembers.id, input.memberId),
      });

      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Verify current user is owner or admin
      const currentMember = await ctx.db.query.teamMembers.findFirst({
        where: and(
          eq(schema.teamMembers.teamId, member.teamId),
          eq(schema.teamMembers.profileId, ctx.session.user.id)
        ),
      });

      if (
        !currentMember ||
        (currentMember.role !== "owner" && currentMember.role !== "admin")
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db
        .delete(schema.teamMembers)
        .where(eq(schema.teamMembers.id, input.memberId));

      return { success: true };
    }),

  // Update member role
  updateMemberRole: protectedProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.isMockMode) {
        logMockUsage("team", "updateMemberRole");
        const member = mockTeamMembers.find((m) => m.id === input.memberId);
        if (!member) throw new TRPCError({ code: "NOT_FOUND" });
        member.role = input.role;
        return member;
      }

      const member = await ctx.db.query.teamMembers.findFirst({
        where: eq(schema.teamMembers.id, input.memberId),
      });

      if (!member) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Verify current user is owner
      const currentMember = await ctx.db.query.teamMembers.findFirst({
        where: and(
          eq(schema.teamMembers.teamId, member.teamId),
          eq(schema.teamMembers.profileId, ctx.session.user.id)
        ),
      });

      if (!currentMember || currentMember.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [updated] = await ctx.db
        .update(schema.teamMembers)
        .set({ role: input.role })
        .where(eq(schema.teamMembers.id, input.memberId))
        .returning();

      return updated;
    }),
});
