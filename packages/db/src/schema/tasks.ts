import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { profiles } from "./profiles";
import { teams } from "./teams";

export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "done", "archived"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"]);

/**
 * Tasks table - Example CRUD entity
 */
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  assigneeId: uuid("assignee_id").references(() => profiles.id, { onDelete: "set null" }),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => profiles.id),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: taskPriorityEnum("priority").default("medium"),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

// Zod schemas
export const CreateTaskSchema = createInsertSchema(tasks, {
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
  isArchived: true,
  status: true,
  createdById: true,
});
