import { Link, usePathname } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface TabItem {
  label: string;
  href: string;
  icon: string;
}

const tabs: TabItem[] = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Tasks", href: "/tasks", icon: "✓" },
  { label: "Activity", href: "/activity", icon: "📊" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
  { label: "Profile", href: "/profile", icon: "👤" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <View className="bg-card border-t border-border">
      <View className="flex-row justify-around items-center py-2 px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link key={tab.href} href={tab.href} asChild>
              <TouchableOpacity
                className={`flex-1 items-center justify-center py-2 px-1 rounded-lg ${
                  active ? "bg-primary/10" : ""
                }`}
              >
                <Text className={`text-xl mb-1 ${active ? "scale-110" : ""}`}>
                  {tab.icon}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
