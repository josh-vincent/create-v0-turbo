export interface ScreenRegistryItem {
  id: string;
  title: string;
  description?: string;
  keywords: string[];
  route: string;
  icon?: string;
  category: ScreenCategory;
  requiresAuth?: boolean;
  requiresPremium?: boolean;
}

export type ScreenCategory =
  | "core"
  | "work"
  | "ai"
  | "media"
  | "social"
  | "finance"
  | "commerce"
  | "crm"
  | "auth"
  | "settings"
  | "ui"
  | "other";

export const SCREEN_REGISTRY: ScreenRegistryItem[] = [
  // Core Screens
  {
    id: "home",
    title: "Home",
    description: "Dashboard overview",
    keywords: ["home", "dashboard", "overview", "main"],
    route: "/",
    icon: "🏠",
    category: "core",
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Manage your tasks",
    keywords: ["tasks", "todos", "work", "projects"],
    route: "/tasks",
    icon: "✓",
    category: "core",
  },
  {
    id: "activity",
    title: "Activity",
    description: "Recent activity feed",
    keywords: ["activity", "recent", "feed", "history"],
    route: "/activity",
    icon: "📊",
    category: "core",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Business metrics and charts",
    keywords: ["analytics", "stats", "metrics", "charts", "data"],
    route: "/analytics",
    icon: "📈",
    category: "core",
  },

  // Work Management Screens
  {
    id: "today",
    title: "Today",
    description: "Today's scheduled jobs",
    keywords: ["today", "schedule", "calendar", "jobs", "daily"],
    route: "/today",
    icon: "📅",
    category: "work",
  },
  {
    id: "jobs",
    title: "Jobs",
    description: "Job management and tracking",
    keywords: ["jobs", "work", "projects", "tasks", "management"],
    route: "/jobs",
    icon: "💼",
    category: "work",
  },
  {
    id: "job-add",
    title: "Add Job",
    description: "Create a new job",
    keywords: ["add", "create", "new", "job", "work order"],
    route: "/job-add",
    icon: "➕",
    category: "work",
  },
  {
    id: "reports",
    title: "Reports",
    description: "Job reports and analytics",
    keywords: ["reports", "analytics", "statistics", "metrics", "insights"],
    route: "/reports",
    icon: "📊",
    category: "work",
  },

  // CRM Screens
  {
    id: "customers",
    title: "Customers",
    description: "Customer management and CRM",
    keywords: ["customers", "contacts", "crm", "clients", "search"],
    route: "/customers",
    icon: "👥",
    category: "crm",
  },

  // Sync & Offline Screens
  {
    id: "sync-status",
    title: "Sync Status",
    description: "Offline sync and network status",
    keywords: ["sync", "offline", "online", "network", "queue", "status"],
    route: "/sync-status",
    icon: "🔄",
    category: "settings",
  },

  // Finance Screens
  {
    id: "billing",
    title: "Billing",
    description: "Subscription management",
    keywords: ["billing", "subscription", "payment", "plan", "upgrade"],
    route: "/billing",
    icon: "💳",
    category: "finance",
  },
  {
    id: "invoices",
    title: "Invoices",
    description: "Invoice management",
    keywords: ["invoices", "bills", "payments", "revenue"],
    route: "/invoices",
    icon: "📄",
    category: "finance",
  },
  {
    id: "expenses",
    title: "Expenses",
    description: "Track expenses",
    keywords: ["expenses", "spending", "costs", "budget"],
    route: "/expenses",
    icon: "💰",
    category: "finance",
  },
  {
    id: "time-tracking",
    title: "Time Tracking",
    description: "Track billable hours",
    keywords: ["time", "tracking", "hours", "billable", "timer"],
    route: "/time-tracking",
    icon: "⏱️",
    category: "finance",
  },

  // Integration & Tools
  {
    id: "integrations",
    title: "Integrations",
    description: "Connect apps and services",
    keywords: ["integrations", "connect", "oauth", "apps", "services"],
    route: "/integrations",
    icon: "🔗",
    category: "other",
  },

  // Settings & Profile
  {
    id: "settings",
    title: "Settings",
    description: "App preferences",
    keywords: ["settings", "preferences", "config", "options"],
    route: "/settings",
    icon: "⚙️",
    category: "settings",
  },
  {
    id: "profile",
    title: "Profile",
    description: "User profile",
    keywords: ["profile", "account", "user", "me"],
    route: "/profile",
    icon: "👤",
    category: "settings",
  },
  {
    id: "team-settings",
    title: "Team Settings",
    description: "Manage team members and permissions",
    keywords: ["team", "members", "staff", "users", "permissions", "roles"],
    route: "/team-settings",
    icon: "👥",
    category: "settings",
  },

  // AI Screens (will be added)
  {
    id: "ai-chat",
    title: "AI Chat",
    description: "Chat with AI assistant",
    keywords: ["ai", "chat", "assistant", "chatbot", "gpt"],
    route: "/ai-chat",
    icon: "💬",
    category: "ai",
    requiresPremium: true,
  },
  {
    id: "ai-voice",
    title: "AI Voice",
    description: "Voice chat with AI",
    keywords: ["ai", "voice", "speak", "audio", "conversation"],
    route: "/ai-voice",
    icon: "🎙️",
    category: "ai",
    requiresPremium: true,
  },
  {
    id: "image-generation",
    title: "Image Generation",
    description: "Generate AI images",
    keywords: ["ai", "image", "generate", "create", "art", "dalle"],
    route: "/image-generation",
    icon: "🎨",
    category: "ai",
    requiresPremium: true,
  },

  // Media Screens (will be added)
  {
    id: "gallery",
    title: "Gallery",
    description: "Photo gallery",
    keywords: ["gallery", "photos", "images", "media", "pictures"],
    route: "/gallery",
    icon: "🖼️",
    category: "media",
  },
  {
    id: "camera",
    title: "Camera",
    description: "Take photos",
    keywords: ["camera", "photo", "picture", "capture"],
    route: "/camera",
    icon: "📷",
    category: "media",
  },

  // Paywall & Monetization (will be added)
  {
    id: "paywall",
    title: "Upgrade",
    description: "Premium features",
    keywords: ["upgrade", "premium", "paywall", "subscribe", "pro"],
    route: "/paywall",
    icon: "⭐",
    category: "other",
  },

  // Permissions (will be added)
  {
    id: "permissions",
    title: "Permissions",
    description: "App permissions",
    keywords: ["permissions", "access", "camera", "location", "photos"],
    route: "/permissions",
    icon: "🔐",
    category: "settings",
  },

  // Onboarding (will be added)
  {
    id: "onboarding",
    title: "Welcome",
    description: "Get started",
    keywords: ["welcome", "onboarding", "intro", "tutorial", "start"],
    route: "/onboarding",
    icon: "👋",
    category: "other",
  },

  // Data Fetching Demos
  {
    id: "data-trpc",
    title: "tRPC Data Fetching",
    description: "tRPC queries and mutations demo",
    keywords: ["trpc", "data", "fetch", "query", "mutation", "demo"],
    route: "/data-trpc",
    icon: "🔄",
    category: "other",
  },
  {
    id: "data-external",
    title: "External API",
    description: "Fetch from external REST APIs",
    keywords: ["external", "api", "rest", "fetch", "demo"],
    route: "/data-external",
    icon: "🌐",
    category: "other",
  },
  {
    id: "data-ai-gateway",
    title: "AI Gateway",
    description: "Vercel AI Gateway integration",
    keywords: ["ai", "gateway", "vercel", "openai", "claude", "grok", "demo"],
    route: "/data-ai-gateway",
    icon: "🤖",
    category: "ai",
  },
  {
    id: "data-supabase",
    title: "Supabase Direct",
    description: "Direct Supabase client queries",
    keywords: ["supabase", "database", "query", "direct", "demo"],
    route: "/data-supabase",
    icon: "💾",
    category: "other",
  },
  {
    id: "data-realtime",
    title: "Realtime Subscriptions",
    description: "Supabase realtime demo",
    keywords: ["realtime", "supabase", "subscriptions", "live", "demo"],
    route: "/data-realtime",
    icon: "🔴",
    category: "other",
  },
  {
    id: "data-offline",
    title: "Offline-First Sync",
    description: "Offline sync patterns",
    keywords: ["offline", "sync", "asyncstorage", "netinfo", "demo"],
    route: "/data-offline",
    icon: "📲",
    category: "other",
  },
  {
    id: "data-offline-advanced",
    title: "Advanced Offline Sync",
    description: "Complex offline sync with jobs, customers, assets",
    keywords: ["offline", "sync", "queue", "jobs", "complex", "relational", "demo"],
    route: "/data-offline-advanced",
    icon: "🔄",
    category: "other",
  },

  // UI States & Transitions
  {
    id: "ui-components",
    title: "UI Components Gallery",
    description: "Button, Badge, and Card components with shadcn/ui design",
    keywords: ["components", "button", "badge", "card", "shadcn", "native", "ui"],
    route: "/ui-components",
    icon: "🧩",
    category: "ui",
  },
  {
    id: "ui-splash",
    title: "Splash Screen",
    description: "Animated splash screen demo",
    keywords: ["splash", "loading", "animation", "startup", "launch", "ui"],
    route: "/ui-splash",
    icon: "🚀",
    category: "ui",
  },
  {
    id: "ui-loading",
    title: "Loading States",
    description: "Spinners, progress bars, and skeleton loaders",
    keywords: ["loading", "spinner", "progress", "skeleton", "shimmer", "ui"],
    route: "/ui-loading",
    icon: "⏳",
    category: "ui",
  },
  {
    id: "ui-states",
    title: "UI States Gallery",
    description: "Empty, error, success, and loading states",
    keywords: ["empty", "error", "success", "states", "feedback", "ui"],
    route: "/ui-states",
    icon: "🎨",
    category: "ui",
  },

  // UI Layout Patterns
  {
    id: "ui-layout-tabs",
    title: "Tabs Layout",
    description: "Tabbed navigation pattern",
    keywords: ["tabs", "navigation", "layout", "pattern", "ui"],
    route: "/ui-layout-tabs",
    icon: "📑",
    category: "ui",
  },
  {
    id: "ui-layout-hero",
    title: "Hero Layout",
    description: "Hero image with overlay content",
    keywords: ["hero", "image", "banner", "layout", "ui"],
    route: "/ui-layout-hero",
    icon: "🖼️",
    category: "ui",
  },
  {
    id: "ui-layout-grid",
    title: "Grid Layout",
    description: "2-column and masonry grid patterns",
    keywords: ["grid", "gallery", "layout", "columns", "ui"],
    route: "/ui-layout-grid",
    icon: "▦",
    category: "ui",
  },
  {
    id: "ui-layout-feed",
    title: "Social Feed Layout",
    description: "Social media feed pattern",
    keywords: ["feed", "social", "posts", "layout", "ui"],
    route: "/ui-layout-feed",
    icon: "📱",
    category: "ui",
  },
  {
    id: "ui-layout-profile",
    title: "Profile Layout",
    description: "User profile page pattern",
    keywords: ["profile", "user", "account", "layout", "ui"],
    route: "/ui-layout-profile",
    icon: "👤",
    category: "ui",
  },
  {
    id: "ui-layout-cards",
    title: "Card List Layout",
    description: "Vertical and horizontal card patterns",
    keywords: ["cards", "list", "articles", "layout", "ui"],
    route: "/ui-layout-cards",
    icon: "🃏",
    category: "ui",
  },
  {
    id: "ui-layout-form",
    title: "Form Layout",
    description: "Form inputs and settings patterns",
    keywords: ["form", "input", "settings", "layout", "ui"],
    route: "/ui-layout-form",
    icon: "📝",
    category: "ui",
  },
  {
    id: "ui-layout-dashboard",
    title: "Dashboard Layout",
    description: "Analytics dashboard pattern",
    keywords: ["dashboard", "analytics", "charts", "metrics", "layout", "ui"],
    route: "/ui-layout-dashboard",
    icon: "📊",
    category: "ui",
  },
];

// Search utility with fuzzy matching
export function searchScreens(query: string): ScreenRegistryItem[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase().trim();

  return SCREEN_REGISTRY
    .map((screen) => {
      // Calculate relevance score
      let score = 0;

      // Exact title match (highest priority)
      if (screen.title.toLowerCase() === lowerQuery) {
        score += 100;
      } else if (screen.title.toLowerCase().includes(lowerQuery)) {
        score += 50;
      }

      // Description match
      if (screen.description?.toLowerCase().includes(lowerQuery)) {
        score += 30;
      }

      // Keyword matches
      screen.keywords.forEach((keyword) => {
        if (keyword === lowerQuery) {
          score += 40;
        } else if (keyword.includes(lowerQuery)) {
          score += 20;
        }
      });

      // ID match
      if (screen.id.includes(lowerQuery)) {
        score += 25;
      }

      return { ...screen, score };
    })
    .filter((screen) => screen.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Return top 10 results
}

// Get screens by category
export function getScreensByCategory(
  category: ScreenCategory,
): ScreenRegistryItem[] {
  return SCREEN_REGISTRY.filter((screen) => screen.category === category);
}

// Get all categories with counts
export function getCategories() {
  const categories = new Map<ScreenCategory, number>();

  SCREEN_REGISTRY.forEach((screen) => {
    const count = categories.get(screen.category) || 0;
    categories.set(screen.category, count + 1);
  });

  return Array.from(categories.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}
