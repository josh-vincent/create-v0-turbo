import { createClient } from "@tocld/supabase/server";
import { redirect } from "next/navigation";
import HeroSection from "~/components/hero-section";

export default async function HomePage() {
  // Check if user is authenticated
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to dashboard if logged in
  if (session) {
    redirect("/dashboard");
  }

  return <HeroSection />;
}
