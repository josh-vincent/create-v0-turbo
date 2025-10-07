import { IntegrationsList } from "@/components/ui/integrations-list";
import { Zap } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
            <p className="text-muted-foreground">Connect your favorite tools and services</p>
          </div>
        </div>
      </div>

      {/* Integrations List */}
      <IntegrationsList />

      {/* Help Section */}
      <div className="mt-12 rounded-lg border p-6 bg-muted/30">
        <h3 className="font-semibold mb-2">Need help connecting?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Check our documentation for detailed setup guides or contact support if you're having
          trouble.
        </p>
        <div className="flex gap-3">
          <a href="/docs/integrations" className="text-sm font-medium text-primary hover:underline">
            View Documentation
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="/support" className="text-sm font-medium text-primary hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
