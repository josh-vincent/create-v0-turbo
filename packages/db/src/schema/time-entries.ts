import { relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const timeEntries = pgTable(
  "time_entries",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    // Project Details
    projectName: text("project_name").notNull(),
    description: text("description").notNull(),

    // Time Tracking
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }),
    duration: integer("duration"), // in minutes

    // Billing
    hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
    billable: boolean("billable").notNull().default(true),

    // Additional Info
    notes: text("notes"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("time_entries_user_id_idx").on(table.userId),
    projectIdx: index("time_entries_project_idx").on(table.projectName),
    startTimeIdx: index("time_entries_start_time_idx").on(table.startTime),
  })
);

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(profiles, {
    fields: [timeEntries.userId],
    references: [profiles.id],
  }),
}));

export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;
