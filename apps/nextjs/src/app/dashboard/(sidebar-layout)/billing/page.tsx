import Link from "next/link";
import { Card } from "~/components/ui/card";
import { SubscriptionCard } from "~/components/payments/subscription-card";
import { BillingCards } from "~/components/payments/billing-cards";

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information.</p>
      </div>

      {/* Subscription Card */}
      <div className="space-y-8">
        <SubscriptionCard />

        {/* Payment Providers */}
        <BillingCards />

        {/* Billing Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Payment Method</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Card</span>
                    <span className="font-medium">•••• •••• •••• 4242</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="font-medium">12/2025</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Next Billing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">$29.00</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">Need to change plans?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You can upgrade or downgrade your plan at any time. Changes will be reflected in your
            next billing cycle.
          </p>
          <Link href="/pricing" className="text-sm text-primary hover:underline">
            View all plans →
          </Link>
        </Card>

        {/* Help Section */}
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Need help?</h3>
          <p className="text-sm text-muted-foreground">
            Have questions about your subscription or billing? Check our{" "}
            <a href="#" className="text-primary hover:underline">
              FAQ
            </a>{" "}
            or{" "}
            <a href="mailto:support@yourcompany.com" className="text-primary hover:underline">
              contact support
            </a>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
