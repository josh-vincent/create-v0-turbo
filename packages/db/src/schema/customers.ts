import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Customer/Contact Management Schema
 * Supports CRM functionality with searchable customer data
 */
export const customers = pgTable(
  "customers",
  {
    id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => crypto.randomUUID()),

    // Basic Information
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    company: varchar("company", { length: 255 }),
    jobTitle: varchar("job_title", { length: 100 }),

    // Address Information
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }),

    // Social & Web
    website: varchar("website", { length: 255 }),
    linkedinUrl: varchar("linkedin_url", { length: 255 }),
    twitterHandle: varchar("twitter_handle", { length: 100 }),

    // CRM Fields
    status: varchar("status", { length: 50 }).notNull().default("active"), // active, inactive, prospect, customer
    source: varchar("source", { length: 100 }), // website, referral, cold-call, etc.
    tags: text("tags"), // JSON array of tags
    notes: text("notes"),

    // Ownership & Assignment
    ownerId: varchar("owner_id", { length: 191 }), // User who owns this customer
    teamId: varchar("team_id", { length: 191 }),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    lastContactedAt: timestamp("last_contacted_at"),
  },
  (table) => ({
    emailIdx: index("customers_email_idx").on(table.email),
    companyIdx: index("customers_company_idx").on(table.company),
    statusIdx: index("customers_status_idx").on(table.status),
    ownerIdx: index("customers_owner_idx").on(table.ownerId),
    teamIdx: index("customers_team_idx").on(table.teamId),
    nameIdx: index("customers_name_idx").on(table.firstName, table.lastName),
  })
);

export const customerNotes = pgTable(
  "customer_notes",
  {
    id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    customerId: varchar("customer_id", { length: 191 })
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),

    content: text("content").notNull(),
    authorId: varchar("author_id", { length: 191 }).notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    customerIdx: index("customer_notes_customer_idx").on(table.customerId),
    authorIdx: index("customer_notes_author_idx").on(table.authorId),
  })
);

export const customerActivities = pgTable(
  "customer_activities",
  {
    id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    customerId: varchar("customer_id", { length: 191 })
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 50 }).notNull(), // call, email, meeting, task
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description"),

    userId: varchar("user_id", { length: 191 }).notNull(), // Who performed the activity

    scheduledAt: timestamp("scheduled_at"),
    completedAt: timestamp("completed_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    customerIdx: index("customer_activities_customer_idx").on(table.customerId),
    typeIdx: index("customer_activities_type_idx").on(table.type),
    userIdx: index("customer_activities_user_idx").on(table.userId),
    scheduledIdx: index("customer_activities_scheduled_idx").on(table.scheduledAt),
  })
);

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  notes: many(customerNotes),
  activities: many(customerActivities),
}));

export const customerNotesRelations = relations(customerNotes, ({ one }) => ({
  customer: one(customers, {
    fields: [customerNotes.customerId],
    references: [customers.id],
  }),
}));

export const customerActivitiesRelations = relations(customerActivities, ({ one }) => ({
  customer: one(customers, {
    fields: [customerActivities.customerId],
    references: [customers.id],
  }),
}));
