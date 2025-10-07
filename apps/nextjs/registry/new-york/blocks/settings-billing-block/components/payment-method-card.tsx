"use client";

import { CreditCard } from "lucide-react";

export function PaymentMethodCard() {
  // This would typically fetch from your API
  const hasPaymentMethod = true;

  return (
    <div className="rounded-lg border p-6">
      {hasPaymentMethod ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2025</p>
            </div>
          </div>
          <button type="button" className="text-sm font-medium text-primary hover:underline">
            Update
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No payment method</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add a payment method to start a subscription
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add Payment Method
          </button>
        </div>
      )}
    </div>
  );
}
