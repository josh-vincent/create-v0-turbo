"use client"

import * as React from "react"
import {
  BookOpen,
  CreditCard,
  Home,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Package,
  Settings2,
  Zap,
  Github,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogoIcon } from "@/components/logo"

const data = {
  user: {
    name: "Demo User",
    email: "demo@example.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Features",
      url: "#",
      icon: Layers,
      items: [
        {
          title: "Tasks",
          url: "/dashboard",
        },
        {
          title: "Integrations",
          url: "/dashboard/integrations",
        },
        {
          title: "Billing",
          url: "/dashboard/billing",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Quick Start",
          url: "/docs/quickstart",
        },
        {
          title: "Architecture",
          url: "/docs/architecture",
        },
        {
          title: "Features",
          url: "/docs/features",
        },
        {
          title: "Testing",
          url: "/docs/testing",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "GitHub",
      url: "https://github.com/yourusername/create-v0-turbo",
      icon: Github,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "@tocld/api",
      url: "#",
      icon: Zap,
    },
    {
      name: "@tocld/features",
      url: "#",
      icon: Package,
    },
    {
      name: "@tocld/ui",
      url: "#",
      icon: LayoutDashboard,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <LogoIcon className="size-4" uniColor />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">v0 Turbo</span>
                  <span className="truncate text-xs">Full-Stack Starter</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
