"use client";

import { CheckoutButton } from "~/components/payments/checkout-button";

const plans = [
  {
    name: "Starter",
    price: "$9",
    period: "per month",
    priceId: "price_starter", // Replace with your actual Stripe/Polar price ID
    features: ["Up to 10 projects", "Basic analytics", "Email support", "1 GB storage"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    priceId: "price_pro", // Replace with your actual Stripe/Polar price ID
    popular: true,
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "10 GB storage",
      "Team collaboration",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    priceId: "price_enterprise", // Replace with your actual Stripe/Polar price ID
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "Unlimited storage",
      "SSO/SAML",
      "SLA guarantee",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border ${
                plan.popular ? "border-primary shadow-xl scale-105" : ""
              } p-8 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg
                      className="h-5 w-5 text-primary shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <CheckoutButton
                priceId={plan.priceId}
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                className="w-full"
                successUrl={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`}
                cancelUrl={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`}
              >
                Get Started
              </CheckoutButton>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Need a custom plan?{" "}
            <a href="mailto:sales@yourcompany.com" className="text-primary hover:underline">
              Contact sales
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
