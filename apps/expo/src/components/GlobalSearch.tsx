import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { ScreenRegistryItem } from "~/utils/screenRegistry";
import { searchScreens } from "~/utils/screenRegistry";

interface GlobalSearchProps {
  visible: boolean;
  onClose: () => void;
}

export function GlobalSearch({ visible, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ScreenRegistryItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchScreens(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelectScreen = (screen: ScreenRegistryItem) => {
    // Save to recent searches
    setRecentSearches((prev) => {
      const updated = [screen.title, ...prev.filter((s) => s !== screen.title)];
      return updated.slice(0, 5); // Keep only 5 recent
    });

    // Navigate to screen
    router.push(screen.route as any);

    // Close search
    setQuery("");
    onClose();
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      core: "bg-blue-500/20 text-blue-600",
      work: "bg-emerald-500/20 text-emerald-600",
      ai: "bg-purple-500/20 text-purple-600",
      media: "bg-pink-500/20 text-pink-600",
      social: "bg-green-500/20 text-green-600",
      finance: "bg-orange-500/20 text-orange-600",
      commerce: "bg-red-500/20 text-red-600",
      crm: "bg-cyan-500/20 text-cyan-600",
      auth: "bg-indigo-500/20 text-indigo-600",
      settings: "bg-gray-500/20 text-gray-600",
      other: "bg-slate-500/20 text-slate-600",
    };
    return colors[category] || colors.other;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/70"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="flex-1 pt-20 px-4">
          <TouchableOpacity activeOpacity={1}>
            {/* Search Input */}
            <View className="bg-background border border-border rounded-2xl mb-4 overflow-hidden">
              <View className="flex-row items-center px-4 py-3 border-b border-border">
                <Text className="text-2xl mr-3">🔍</Text>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search screens..."
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-base text-foreground"
                  autoFocus
                  returnKeyType="search"
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery("")}>
                    <Text className="text-muted-foreground ml-2">✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Results or Recent */}
              <View className="max-h-96">
                {query.trim() ? (
                  // Search Results
                  results.length > 0 ? (
                    <FlatList
                      data={results}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleSelectScreen(item)}
                          className="px-4 py-3 border-b border-border/50 flex-row items-center"
                        >
                          <View className="w-10 h-10 bg-primary/20 rounded-full items-center justify-center mr-3">
                            <Text className="text-xl">{item.icon}</Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-medium text-foreground">
                              {item.title}
                            </Text>
                            {item.description && (
                              <Text className="text-sm text-muted-foreground mt-0.5">
                                {item.description}
                              </Text>
                            )}
                          </View>
                          <View
                            className={`px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}
                          >
                            <Text className="text-xs font-medium capitalize">
                              {item.category}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <View className="py-8 px-4">
                      <Text className="text-center text-muted-foreground">
                        No screens found for "{query}"
                      </Text>
                    </View>
                  )
                ) : (
                  // Recent Searches
                  <View className="py-2">
                    {recentSearches.length > 0 ? (
                      <>
                        <View className="flex-row items-center justify-between px-4 py-2">
                          <Text className="text-sm font-semibold text-muted-foreground uppercase">
                            Recent
                          </Text>
                          <TouchableOpacity onPress={handleClearRecent}>
                            <Text className="text-sm text-primary">Clear</Text>
                          </TouchableOpacity>
                        </View>
                        {recentSearches.map((search, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => setQuery(search)}
                            className="px-4 py-3 flex-row items-center"
                          >
                            <Text className="text-lg mr-3">🕒</Text>
                            <Text className="text-base text-foreground">
                              {search}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </>
                    ) : (
                      <View className="py-8 px-4">
                        <Text className="text-center text-muted-foreground">
                          Start typing to search screens
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Quick Tips */}
            <View className="bg-card border border-border rounded-lg p-3">
              <Text className="text-xs text-muted-foreground text-center">
                💡 Try searching: "AI chat", "invoices", "upgrade", "camera"
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Search Button Component (to be added to header)
export function SearchButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-muted border border-border rounded-lg px-3 py-2 flex-row items-center"
    >
      <Text className="text-base mr-2">🔍</Text>
      <Text className="text-sm text-muted-foreground">Search...</Text>
    </TouchableOpacity>
  );
}
