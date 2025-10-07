import { createClient } from "@tocld/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // In production, redirect to login
  // In mock mode, this is handled by middleware
  if (!session && process.env.NODE_ENV === "production") {
    redirect("/login");
  }

  return <>{children}</>;
}
