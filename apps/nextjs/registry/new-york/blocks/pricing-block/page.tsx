import { CheckoutButton } from "@/components/ui/checkout-button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for trying out the platform",
    price: "$9",
    period: "/month",
    priceId: "price_starter_monthly",
    features: [
      "Up to 10 projects",
      "Basic analytics",
      "48-hour support response",
      "Community access",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For serious professionals",
    price: "$29",
    period: "/month",
    priceId: "price_pro_monthly",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom integrations",
      "Advanced reporting",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    period: "",
    priceId: "price_enterprise",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Custom contracts",
      "On-premise deployment",
      "Advanced security",
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container py-16 md:py-24">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose the plan that's right for you. No hidden fees.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-8 ${
              plan.highlighted ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                  Most Popular
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <CheckoutButton
              priceId={plan.priceId}
              variant={plan.highlighted ? "default" : "outline"}
              size="lg"
              className="w-full"
            >
              {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
            </CheckoutButton>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-3xl mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the
              start of your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, debit cards, and support various payment methods
              through our payment processor.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              Yes, all paid plans come with a 14-day free trial. No credit card required to start.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
