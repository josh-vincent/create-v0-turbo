// Add Supabase database types here
// Generate with: supabase gen types --lang=typescript --project-id PROJECT_ID --schema public

export type Database = {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
};
