import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const expenses = pgTable(
  "expenses",
  {
    id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    // Expense Details
    description: text("description").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    category: varchar("category", { length: 50 })
      .notNull()
      .$type<"software" | "marketing" | "operations" | "hr" | "travel" | "equipment" | "other">(),
    date: timestamp("date", { withTimezone: true }).notNull(),

    // Optional Details
    vendor: text("vendor"),
    receiptUrl: text("receipt_url"),
    notes: text("notes"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("expenses_user_id_idx").on(table.userId),
    categoryIdx: index("expenses_category_idx").on(table.category),
    dateIdx: index("expenses_date_idx").on(table.date),
  })
);

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(profiles, {
    fields: [expenses.userId],
    references: [profiles.id],
  }),
}));

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
