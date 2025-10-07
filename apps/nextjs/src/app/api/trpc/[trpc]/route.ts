import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { type Session, appRouter, createTRPCContext } from "@tocld/api";
import { createClient } from "@tocld/supabase/server";

import { authConfig } from "~/lib/auth-config";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  let mappedSession: Session | null = null;

  if (authConfig.isMockMode) {
    // Provide mock session for development
    mappedSession = authConfig.mockSession;
  } else {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Map Supabase session to our Session type
    mappedSession = session
      ? {
          user: {
            id: session.user.id,
            email: session.user.email,
          },
        }
      : null;
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        session: mappedSession,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
