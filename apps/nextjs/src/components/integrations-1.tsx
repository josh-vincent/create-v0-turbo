import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronRight,
  Github,
  Mail,
  Calendar,
  HardDrive,
  Box,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { INTEGRATION_METADATA, type IntegrationProvider } from "@tocld/features-integrations/constants";

const ICON_MAP: Record<IntegrationProvider, LucideIcon> = {
  gmail: Mail,
  outlook: Calendar,
  google_drive: HardDrive,
  dropbox: Box,
  slack: MessageSquare,
  github: Github,
};

const COLOR_MAP: Record<string, string> = {
  red: "text-red-600",
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  gray: "text-gray-900 dark:text-white",
};

const INTEGRATIONS = (Object.keys(INTEGRATION_METADATA) as IntegrationProvider[]).map(
  (provider) => ({
    id: provider,
    title: INTEGRATION_METADATA[provider].name,
    description: INTEGRATION_METADATA[provider].description,
    icon: ICON_MAP[provider],
    color: COLOR_MAP[INTEGRATION_METADATA[provider].color],
  }),
);

export default function IntegrationsSection() {
  return (
    <section>
      <div className="py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Connect Your Favorite Tools
            </h2>
            <p className="text-muted-foreground mt-6">
              Seamlessly integrate with popular platforms to streamline your workflow and boost productivity.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((integration) => (
              <IntegrationCard
                key={integration.id}
                title={integration.title}
                description={integration.description}
                icon={integration.icon}
                color={integration.color}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) => {
  return (
    <Card className="p-6">
      <div className="relative">
        <div className="flex items-center justify-center size-10 rounded-lg bg-muted">
          <Icon className={`size-5 ${color}`} />
        </div>

        <div className="space-y-2 py-6">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
        </div>

        <div className="flex gap-3 border-t border-dashed pt-6">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="gap-1 pr-2 shadow-none"
          >
            <Link href="/dashboard/integrations">
              Connect Now
              <ChevronRight className="ml-0 !size-3.5 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
