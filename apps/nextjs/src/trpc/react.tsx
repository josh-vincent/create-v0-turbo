"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider, isServer } from "@tanstack/react-query";
import type { AppRouter } from "@tocld/api";
import { createClient } from "@tocld/supabase/client";
import { type TRPCLink, createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import superjson from "superjson";
import { createQueryClient } from "./query-client";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

// Export api as an alias for useTRPC for convenience
export const api = useTRPC;

let browserQueryClient: QueryClient;

function getQueryClient() {
  if (isServer) {
    return createQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}

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
            const supabase = createClient();
            supabase.auth.signOut().then(() => {
              if (typeof window !== "undefined") {
                const returnTo = window.location.pathname + window.location.search;
                window.location.href = `/login?return_to=${encodeURIComponent(returnTo)}`;
              }
            });
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

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        errorLink,
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          async headers() {
            const supabase = createClient();

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

                return {
                  Authorization: `Bearer ${refreshedSession?.access_token || session.access_token}`,
                };
              }
            }

            return {
              Authorization: session?.access_token ? `Bearer ${session.access_token}` : "",
            };
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
