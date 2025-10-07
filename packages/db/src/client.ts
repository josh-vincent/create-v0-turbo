import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// Use Supabase connection string from environment
const connectionString = process.env.POSTGRES_URL;

/**
 * Check if database is available
 * Returns true if POSTGRES_URL is set and valid
 */
export const isDatabaseAvailable = (): boolean => {
  return !!(connectionString && connectionString.length > 0 && connectionString !== "undefined");
};

// Only initialize database clients if connection string is available
let migrationClient: postgres.Sql | undefined;
let queryClient: postgres.Sql | undefined;
let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

if (isDatabaseAvailable()) {
  console.log("✅ [DATABASE] Initializing with connection string");
  migrationClient = postgres(connectionString!, { max: 1 });
  queryClient = postgres(connectionString!);
  db = drizzle(queryClient, {
    schema,
    casing: "snake_case",
  });
} else {
  console.log("🔶 [DATABASE] No connection string found - running in MOCK MODE");
}

export { migrationClient, db };
