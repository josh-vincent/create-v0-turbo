import { Link } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: string;
}

interface MenuCategory {
  title: string;
  icon: string;
  items: MenuItem[];
}

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Core"])
  );

  const menuCategories: MenuCategory[] = [
    {
      title: "Core",
      icon: "🏠",
      items: [
        { title: "Home", href: "/", icon: "🏠" },
        { title: "Tasks", href: "/tasks", icon: "✓" },
        { title: "Activity", href: "/activity", icon: "📊" },
        { title: "Analytics", href: "/analytics", icon: "📈" },
      ],
    },
    {
      title: "Work Management",
      icon: "💼",
      items: [
        { title: "Today", href: "/today", icon: "📅" },
        { title: "Jobs", href: "/jobs", icon: "💼" },
        { title: "Add Job", href: "/job-add", icon: "➕" },
        { title: "Reports", href: "/reports", icon: "📊" },
      ],
    },
    {
      title: "AI Features",
      icon: "🤖",
      items: [
        { title: "AI Chat", href: "/ai-chat", icon: "💬" },
        { title: "AI Voice", href: "/ai-voice", icon: "🎤" },
        { title: "Image Generation", href: "/image-generation", icon: "🎨" },
      ],
    },
    {
      title: "CRM",
      icon: "👥",
      items: [
        { title: "Customers", href: "/customers", icon: "👥" },
        { title: "Add Customer", href: "/customer-add", icon: "➕" },
      ],
    },
    {
      title: "Finance",
      icon: "💰",
      items: [
        { title: "Billing", href: "/billing", icon: "💳" },
        { title: "Invoices", href: "/invoices", icon: "📄" },
        { title: "Expenses", href: "/expenses", icon: "💸" },
        { title: "Time Tracking", href: "/time-tracking", icon: "⏱️" },
      ],
    },
    {
      title: "Integrations",
      icon: "🔗",
      items: [
        { title: "Integrations", href: "/integrations", icon: "🔗" },
      ],
    },
    {
      title: "Settings",
      icon: "⚙️",
      items: [
        { title: "Settings", href: "/settings", icon: "⚙️" },
        { title: "Profile", href: "/profile", icon: "👤" },
        { title: "Team Settings", href: "/team-settings", icon: "👥" },
        { title: "Sync Status", href: "/sync-status", icon: "🔄" },
        { title: "Permissions", href: "/permissions", icon: "🔐" },
      ],
    },
    {
      title: "Premium",
      icon: "⭐",
      items: [
        { title: "Paywall", href: "/paywall", icon: "💎" },
      ],
    },
    {
      title: "Data Fetching Demos",
      icon: "📡",
      items: [
        { title: "tRPC Data Fetching", href: "/data-trpc", icon: "🔄" },
        { title: "External API", href: "/data-external", icon: "🌐" },
        { title: "AI Gateway", href: "/data-ai-gateway", icon: "🤖" },
        { title: "Supabase Direct", href: "/data-supabase", icon: "💾" },
        { title: "Realtime Subscriptions", href: "/data-realtime", icon: "🔴" },
        { title: "Offline-First Sync", href: "/data-offline", icon: "📲" },
        { title: "Advanced Offline Sync", href: "/data-offline-advanced", icon: "🔄" },
      ],
    },
    {
      title: "UI States & Transitions",
      icon: "🎨",
      items: [
        { title: "Components Gallery", href: "/ui-components", icon: "🧩" },
        { title: "Splash Screen", href: "/ui-splash", icon: "🚀" },
        { title: "Loading States", href: "/ui-loading", icon: "⏳" },
        { title: "UI States Gallery", href: "/ui-states", icon: "🎨" },
      ],
    },
    {
      title: "UI Layout Patterns",
      icon: "📐",
      items: [
        { title: "Tabs Layout", href: "/ui-layout-tabs", icon: "📑" },
        { title: "Hero Layout", href: "/ui-layout-hero", icon: "🖼️" },
        { title: "Grid Layout", href: "/ui-layout-grid", icon: "▦" },
        { title: "Social Feed", href: "/ui-layout-feed", icon: "📱" },
        { title: "Profile Layout", href: "/ui-layout-profile", icon: "👤" },
        { title: "Card List", href: "/ui-layout-cards", icon: "🃏" },
        { title: "Form Layout", href: "/ui-layout-form", icon: "📝" },
        { title: "Dashboard", href: "/ui-layout-dashboard", icon: "📊" },
      ],
    },
  ];

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="bg-background w-4/5 h-full flex">
          <TouchableOpacity activeOpacity={1} className="flex-1">
            {/* Header */}
            <View className="bg-primary p-6 pt-16">
              <Text className="text-2xl font-bold text-primary-foreground mb-1">
                Create V0 Turbo
              </Text>
              <Text className="text-sm text-primary-foreground/80">
                Navigation Menu
              </Text>
            </View>

            {/* Menu Categories - Scrollable */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="p-4">
                {menuCategories.map((category) => {
                  const isExpanded = expandedCategories.has(category.title);

                  return (
                    <View key={category.title} className="mb-3">
                      {/* Category Header */}
                      <TouchableOpacity
                        onPress={() => toggleCategory(category.title)}
                        className="flex-row items-center justify-between p-4 bg-muted rounded-lg border border-border"
                      >
                        <View className="flex-row items-center flex-1">
                          <Text className="text-xl mr-3">{category.icon}</Text>
                          <Text className="text-base font-semibold text-foreground">
                            {category.title}
                          </Text>
                          <View className="ml-2 bg-primary/20 px-2 py-0.5 rounded-full">
                            <Text className="text-xs font-medium text-primary">
                              {category.items.length}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-muted-foreground text-lg">
                          {isExpanded ? "▼" : "▶"}
                        </Text>
                      </TouchableOpacity>

                      {/* Category Items */}
                      {isExpanded && (
                        <View className="mt-2 ml-4 border-l-2 border-border pl-2">
                          {category.items.map((item) => (
                            <Link key={item.href} href={item.href} asChild>
                              <TouchableOpacity
                                onPress={onClose}
                                className="flex-row items-center p-3 rounded-lg mb-1 bg-card border border-border active:bg-primary/10"
                              >
                                <Text className="text-lg mr-3">{item.icon}</Text>
                                <Text className="text-sm font-medium text-foreground">
                                  {item.title}
                                </Text>
                              </TouchableOpacity>
                            </Link>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}

                {/* Expand/Collapse All */}
                <View className="flex-row gap-2 mt-4">
                  <TouchableOpacity
                    onPress={() =>
                      setExpandedCategories(
                        new Set(menuCategories.map((c) => c.title))
                      )
                    }
                    className="flex-1 bg-muted border border-border rounded-lg p-3 items-center"
                  >
                    <Text className="text-sm font-medium text-foreground">
                      Expand All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setExpandedCategories(new Set())}
                    className="flex-1 bg-muted border border-border rounded-lg p-3 items-center"
                  >
                    <Text className="text-sm font-medium text-foreground">
                      Collapse All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="p-4 border-t border-border bg-background">
              <Text className="text-xs text-muted-foreground text-center">
                Version 1.0.0
              </Text>
              <Text className="text-xs text-muted-foreground text-center mt-1">
                Expo 54 • React Native 0.81.4
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
