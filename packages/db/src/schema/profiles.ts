import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * User profiles table
 * Linked to Supabase auth.users via user_id
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(), // References auth.users
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
