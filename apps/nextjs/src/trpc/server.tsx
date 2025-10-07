import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";

import type { AppRouter, Session } from "@tocld/api";
import { appRouter, createTRPCContext } from "@tocld/api";
import { createClient } from "@tocld/supabase/server";

import { authConfig } from "~/lib/auth-config";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  // Get session from Supabase or mock
  let session: Session | null = null;

  if (authConfig.isMockMode) {
    // Use mock session
    session = authConfig.mockSession;
  } else {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        session = {
          user: {
            id: data.user.id,
            email: data.user.email,
          },
        };
      }
    } catch (error) {
      console.error("Error getting Supabase session:", error);
      session = null;
    }
  }

  return createTRPCContext({
    headers: heads,
    session,
  });
});

const getQueryClient = cache(createQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
