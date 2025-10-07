import { SubscriptionCard } from "@/components/ui/subscription-card";
import { CreditCard, FileText, Receipt } from "lucide-react";
import { InvoicesTable } from "./components/invoices-table";
import { PaymentMethodCard } from "./components/payment-method-card";

export default function BillingSettingsPage() {
  return (
    <div className="container max-w-5xl py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and billing history
        </p>
      </div>

      <div className="space-y-8">
        {/* Current Subscription */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Current Subscription</h2>
          </div>
          <SubscriptionCard />
        </section>

        {/* Payment Methods */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Payment Method</h2>
          </div>
          <PaymentMethodCard />
        </section>

        {/* Billing History */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Billing History</h2>
          </div>
          <InvoicesTable />
        </section>
      </div>
    </div>
  );
}
