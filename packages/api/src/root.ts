import { authRouter } from "./router/auth";
import { demoRouter } from "./router/demo";
import { taskRouter } from "./router/task";
import { teamRouter } from "./router/team";
import { createTRPCRouter } from "./trpc";

// Feature modules (optional - only imported if packages are installed)
let subscriptionRouter: any;
let integrationRouter: any;
let invoiceRouter: any;
let expenseRouter: any;
let timeRouter: any;
let customerRouter: any;
let customerNoteRouter: any;
let customerActivityRouter: any;

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

try {
  const financeModule = require("@tocld/features-finance/routers");
  invoiceRouter = financeModule.invoiceRouter;
  expenseRouter = financeModule.expenseRouter;
  timeRouter = financeModule.timeRouter;
} catch {
  // Finance features not installed
}

try {
  const crmModule = require("@tocld/features-crm/routers");
  customerRouter = crmModule.customerRouter;
  customerNoteRouter = crmModule.customerNoteRouter;
  customerActivityRouter = crmModule.customerActivityRouter;
} catch {
  // CRM features not installed
}

export const appRouter = createTRPCRouter({
  auth: authRouter,
  demo: demoRouter,
  task: taskRouter,
  team: teamRouter,
  // Conditionally add feature routers if packages are installed
  ...(subscriptionRouter ? { subscription: subscriptionRouter } : {}),
  ...(integrationRouter ? { integration: integrationRouter } : {}),
  ...(invoiceRouter ? { invoice: invoiceRouter } : {}),
  ...(expenseRouter ? { expense: expenseRouter } : {}),
  ...(timeRouter ? { time: timeRouter } : {}),
  ...(customerRouter ? { customer: customerRouter } : {}),
  ...(customerNoteRouter ? { customerNote: customerNoteRouter } : {}),
  ...(customerActivityRouter ? { customerActivity: customerActivityRouter } : {}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
