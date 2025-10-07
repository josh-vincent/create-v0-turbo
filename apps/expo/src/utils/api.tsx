import { QueryClient } from "@tanstack/react-query";
import { type TRPCLink, createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@tocld/api";

import { supabase } from "./auth";
import { getBaseUrl } from "./base-url";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    },
  },
});

// Custom error link to handle authentication errors
const errorLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          observer.next(value);
        },
        error(err) {
          // Handle UNAUTHORIZED errors (expired sessions)
          if (err.data?.code === "UNAUTHORIZED") {
            supabase.auth.signOut();
          }
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      errorLink,
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
        colorMode: "ansi",
      }),
      httpBatchLink({
        transformer: superjson,
        url: `${getBaseUrl()}/api/trpc`,
        async headers() {
          const headers = new Map<string, string>();
          headers.set("x-trpc-source", "expo-react");

          const {
            data: { session },
          } = await supabase.auth.getSession();

          // If session exists, check if token is expired or will expire soon
          if (session?.expires_at) {
            const expiresAt = session.expires_at * 1000;
            const now = Date.now();
            const bufferTime = 60 * 1000; // 60 seconds buffer

            if (expiresAt - now < bufferTime) {
              const {
                data: { session: refreshedSession },
              } = await supabase.auth.refreshSession();

              if (refreshedSession?.access_token) {
                headers.set("Authorization", `Bearer ${refreshedSession.access_token}`);
              } else if (session.access_token) {
                headers.set("Authorization", `Bearer ${session.access_token}`);
              }
            } else if (session.access_token) {
              headers.set("Authorization", `Bearer ${session.access_token}`);
            }
          }

          return headers;
        },
      }),
    ],
  }),
  queryClient,
});

export type { RouterInputs, RouterOutputs } from "@tocld/api";
