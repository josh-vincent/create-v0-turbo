import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar, decimal } from "drizzle-orm/pg-core";

import { customers } from "./customers";

/**
 * Job/Work Management Schema
 * For tracking jobs, work orders, and service requests
 */
export const jobs = pgTable(
  "jobs",
  {
    id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => crypto.randomUUID()),

    // Job Information
    jobNumber: varchar("job_number", { length: 50 }).notNull().unique(),
    customerId: varchar("customer_id", { length: 191 })
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),

    // Contact Details (can override customer defaults)
    contactPerson: varchar("contact_person", { length: 255 }),
    contactNumber: varchar("contact_number", { length: 50 }),

    // Location
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),

    // Job Specifics
    equipmentType: varchar("equipment_type", { length: 255 }),
    materialType: varchar("material_type", { length: 255 }),

    // Pricing
    price: decimal("price", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("USD"),

    // Status & Notes
    status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, in-progress, completed, cancelled
    notes: text("notes"),

    // Assignment
    assignedTo: varchar("assigned_to", { length: 191 }), // User ID
    teamId: varchar("team_id", { length: 191 }),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    scheduledAt: timestamp("scheduled_at"),
    completedAt: timestamp("completed_at"),
  },
  (table) => ({
    jobNumberIdx: index("jobs_job_number_idx").on(table.jobNumber),
    customerIdx: index("jobs_customer_idx").on(table.customerId),
    statusIdx: index("jobs_status_idx").on(table.status),
    assignedIdx: index("jobs_assigned_idx").on(table.assignedTo),
    teamIdx: index("jobs_team_idx").on(table.teamId),
    scheduledIdx: index("jobs_scheduled_idx").on(table.scheduledAt),
  })
);

// Relations
export const jobsRelations = relations(jobs, ({ one }) => ({
  customer: one(customers, {
    fields: [jobs.customerId],
    references: [customers.id],
  }),
}));
