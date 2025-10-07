import { CheckoutButton } from "@/components/ui/checkout-button";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  period?: string;
  priceId: string;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard({
  name,
  description,
  price,
  period,
  priceId,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        highlighted ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Pricing */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight">{price}</span>
          {period && <span className="text-muted-foreground">{period}</span>}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <CheckoutButton
        priceId={priceId}
        variant={highlighted ? "default" : "outline"}
        size="lg"
        className="w-full"
      >
        {price === "Custom" ? "Contact Sales" : "Get Started"}
      </CheckoutButton>
    </div>
  );
}
