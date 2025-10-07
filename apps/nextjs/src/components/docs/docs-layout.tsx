import { cn } from "@tocld/ui";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@tocld/ui/breadcrumb";
import { Home } from "lucide-react";

interface DocsLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const docsNav = [
  { title: "Quick Start", href: "/docs/quickstart" },
  { title: "Architecture", href: "/docs/architecture" },
  { title: "Features", href: "/docs/features" },
  { title: "Testing", href: "/docs/testing" },
];

export function DocsLayout({ children, title, description, breadcrumbs }: DocsLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="hidden w-64 border-r bg-muted/10 lg:block">
          <div className="sticky top-0 flex h-full flex-col gap-4 p-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Documentation</h3>
              <nav className="space-y-1">
                {docsNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container max-w-4xl py-6 lg:py-10">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    <Home className="h-4 w-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs/quickstart">Docs</BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs?.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="mb-8 space-y-3">
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{title}</h1>
              {description && (
                <p className="text-lg text-muted-foreground">{description}</p>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
