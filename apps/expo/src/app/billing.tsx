import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

import { LoadingSkeleton } from "~/components/LoadingSkeleton";

export default function BillingScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>("free");

  // Mock subscription data
  const subscription = {
    plan: "Free",
    status: "active",
    renewsAt: "N/A",
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["5 tasks per month", "Basic analytics", "Email support"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9",
      period: "per month",
      features: [
        "Unlimited tasks",
        "Advanced analytics",
        "Priority support",
        "Team collaboration",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$29",
      period: "per month",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Advanced security",
      ],
    },
  ];

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Billing & Subscription" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Current Subscription */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-foreground mb-4">
              Current Subscription
            </Text>
            <View className="bg-card border border-border rounded-lg p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-medium text-foreground">
                  {subscription.plan} Plan
                </Text>
                <View className="bg-green-500/20 px-3 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-green-600">
                    {subscription.status}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-muted-foreground">
                Renews: {subscription.renewsAt}
              </Text>
            </View>
          </View>

          {/* Available Plans */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-foreground mb-4">
              Available Plans
            </Text>
            <View className="space-y-3">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                const isCurrent = plan.id === "free";

                return (
                  <TouchableOpacity
                    key={plan.id}
                    onPress={() => setSelectedPlan(plan.id)}
                    className={`bg-card border-2 rounded-lg p-4 ${
                      isSelected ? "border-primary" : "border-border"
                    }`}
                  >
                    {/* Plan header */}
                    <View className="flex-row justify-between items-start mb-3">
                      <View>
                        <Text className="text-lg font-bold text-foreground">
                          {plan.name}
                        </Text>
                        <View className="flex-row items-baseline mt-1">
                          <Text className="text-2xl font-bold text-primary">
                            {plan.price}
                          </Text>
                          <Text className="text-sm text-muted-foreground ml-1">
                            {plan.period}
                          </Text>
                        </View>
                      </View>
                      {isCurrent && (
                        <View className="bg-primary/20 px-2 py-1 rounded">
                          <Text className="text-xs font-semibold text-primary">
                            Current
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Features */}
                    <View className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <View key={index} className="flex-row items-center">
                          <Text className="text-primary mr-2">✓</Text>
                          <Text className="text-sm text-muted-foreground">
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Upgrade button */}
          {selectedPlan && selectedPlan !== "free" && (
            <TouchableOpacity className="bg-primary rounded-lg p-4 items-center mb-6">
              <Text className="text-base font-semibold text-primary-foreground">
                Upgrade to {plans.find((p) => p.id === selectedPlan)?.name}
              </Text>
            </TouchableOpacity>
          )}

          {/* Payment Method */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-foreground mb-4">
              Payment Method
            </Text>
            <View className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-8 bg-primary/20 rounded items-center justify-center mr-3">
                  <Text className="text-lg">💳</Text>
                </View>
                <View>
                  <Text className="text-base font-medium text-foreground">
                    No payment method
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Add a payment method to upgrade
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text className="text-primary font-medium">Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Billing History */}
          <View>
            <Text className="text-xl font-semibold text-foreground mb-4">
              Billing History
            </Text>
            <View className="bg-muted rounded-lg p-6 items-center">
              <Text className="text-sm text-muted-foreground text-center">
                No billing history available
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
