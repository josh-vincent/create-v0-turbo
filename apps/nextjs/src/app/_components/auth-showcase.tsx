import { redirect } from "next/navigation";

import { createClient } from "@tocld/supabase/server";
import { Button } from "@tocld/ui/button";

import { authConfig } from "~/lib/auth-config";

export async function AuthShowcase() {
  if (authConfig.isMockMode) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl">
          <span>Logged in as {authConfig.mockSession.user.email}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          🔓 Mock Mode Active - Authentication Bypassed
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            redirect("/login");
          }}
        >
          Sign in
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.email}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            const supabase = await createClient();
            await supabase.auth.signOut();
            redirect("/login");
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
