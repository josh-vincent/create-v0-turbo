import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function IntegrationsScreen() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  const integrations = [
    {
      id: "gmail",
      name: "Gmail",
      icon: "📧",
      description: "Connect your Gmail account for email integration",
      connected: connectedIntegrations.includes("gmail"),
    },
    {
      id: "outlook",
      name: "Outlook",
      icon: "📨",
      description: "Connect your Outlook account for email integration",
      connected: connectedIntegrations.includes("outlook"),
    },
    {
      id: "github",
      name: "GitHub",
      icon: "🐙",
      description: "Connect your GitHub account for repository access",
      connected: connectedIntegrations.includes("github"),
    },
    {
      id: "slack",
      name: "Slack",
      icon: "💬",
      description: "Connect your Slack workspace for notifications",
      connected: connectedIntegrations.includes("slack"),
    },
    {
      id: "notion",
      name: "Notion",
      icon: "📝",
      description: "Sync your tasks with Notion databases",
      connected: connectedIntegrations.includes("notion"),
    },
  ];

  const toggleIntegration = (id: string) => {
    if (connectedIntegrations.includes(id)) {
      setConnectedIntegrations(connectedIntegrations.filter((i) => i !== id));
    } else {
      setConnectedIntegrations([...connectedIntegrations, id]);
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Integrations" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Integrations
            </Text>
            <Text className="text-base text-muted-foreground">
              Connect your favorite tools and services
            </Text>
          </View>

          {/* Connected Count */}
          <View className="bg-card border border-border rounded-lg p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted-foreground mb-1">
                  Connected Integrations
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {connectedIntegrations.length}
                </Text>
              </View>
              <View className="w-16 h-16 bg-primary/20 rounded-full items-center justify-center">
                <Text className="text-3xl">🔗</Text>
              </View>
            </View>
          </View>

          {/* Available Integrations */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Available Integrations
            </Text>
            <View className="space-y-3">
              {integrations.map((integration) => (
                <View
                  key={integration.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <View className="flex-row items-start">
                    {/* Icon */}
                    <View className="w-12 h-12 bg-primary/20 rounded-full items-center justify-center mr-4">
                      <Text className="text-2xl">{integration.icon}</Text>
                    </View>

                    {/* Info */}
                    <View className="flex-1 mr-2">
                      <Text className="text-base font-semibold text-foreground mb-1">
                        {integration.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {integration.description}
                      </Text>
                    </View>

                    {/* Connect Button */}
                    <TouchableOpacity
                      onPress={() => toggleIntegration(integration.id)}
                      className={`px-4 py-2 rounded-lg ${
                        integration.connected
                          ? "bg-destructive/20"
                          : "bg-primary"
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          integration.connected
                            ? "text-destructive"
                            : "text-primary-foreground"
                        }`}
                      >
                        {integration.connected ? "Disconnect" : "Connect"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Connected status */}
                  {integration.connected && (
                    <View className="mt-3 pt-3 border-t border-border">
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <Text className="text-sm text-green-600">
                          Connected and active
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Help Text */}
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-sm text-muted-foreground text-center">
              💡 Tip: Connect your favorite tools to sync data and automate workflows
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
