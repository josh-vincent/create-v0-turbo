import { authRouter } from "./router/auth";
import { taskRouter } from "./router/task";
import { createTRPCRouter } from "./trpc";

// Feature modules (optional - only imported if packages are installed)
let subscriptionRouter: any;
let integrationRouter: any;

try {
  const paymentsModule = require("@tocld/features-payments/routers");
  subscriptionRouter = paymentsModule.subscriptionRouter;
} catch {
  // Payment features not installed
}

try {
  const integrationsModule = require("@tocld/features-integrations/routers");
  integrationRouter = integrationsModule.integrationRouter;
} catch {
  // Integration features not installed
}

export const appRouter = createTRPCRouter({
  auth: authRouter,
  task: taskRouter,
  // Conditionally add feature routers if packages are installed
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
  ...(integrationRouter ? { integration: integrationRouter } : {}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
