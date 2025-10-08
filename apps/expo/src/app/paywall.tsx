import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "yearly",
  );

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 AI chats per day",
        "Basic task management",
        "2 integrations",
        "Email support",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: billingPeriod === "monthly" ? "$12" : "$99",
      period: billingPeriod === "monthly" ? "per month" : "per year",
      savings: billingPeriod === "yearly" ? "Save $45" : undefined,
      popular: true,
      features: [
        "Unlimited AI chats",
        "AI voice conversations",
        "Image generation (50/mo)",
        "Unlimited tasks & projects",
        "All integrations",
        "Priority support",
        "Advanced analytics",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingPeriod === "monthly" ? "$29" : "$299",
      period: billingPeriod === "monthly" ? "per month" : "per year",
      savings: billingPeriod === "yearly" ? "Save $49" : undefined,
      features: [
        "Everything in Pro",
        "Unlimited image generation",
        "Custom AI training",
        "Team collaboration",
        "Dedicated support",
        "SLA guarantee",
        "Custom integrations",
      ],
    },
  ];

  const benefits = [
    { icon: "🤖", text: "AI-powered productivity" },
    { icon: "🔒", text: "Secure & private" },
    { icon: "📱", text: "Works offline" },
    { icon: "♾️", text: "Cancel anytime" },
  ];

  const handleSubscribe = () => {
    // In production: Navigate to checkout or trigger purchase
    console.log(`Subscribing to ${selectedPlan} (${billingPeriod})`);
    router.back();
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Upgrade",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-base text-primary-foreground mr-4">
                ✕
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-4">
              <Text className="text-5xl">⭐</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground text-center mb-2">
              Unlock Premium Features
            </Text>
            <Text className="text-base text-muted-foreground text-center">
              Get unlimited access to all features
            </Text>
          </View>

          {/* Billing Toggle */}
          <View className="flex-row bg-muted rounded-full p-1 mb-6">
            <TouchableOpacity
              onPress={() => setBillingPeriod("monthly")}
              className={`flex-1 py-3 rounded-full ${
                billingPeriod === "monthly" ? "bg-background" : ""
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  billingPeriod === "monthly"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBillingPeriod("yearly")}
              className={`flex-1 py-3 rounded-full ${
                billingPeriod === "yearly" ? "bg-background" : ""
              }`}
            >
              <View className="items-center">
                <Text
                  className={`font-semibold ${
                    billingPeriod === "yearly"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Yearly
                </Text>
                {billingPeriod === "yearly" && (
                  <Text className="text-xs text-primary font-semibold">
                    Save 30%
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Plans */}
          <View className="gap-4 mb-6">
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                className={`border-2 rounded-2xl p-5 ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                } ${plan.popular ? "relative" : ""}`}
              >
                {plan.popular && (
                  <View className="absolute top-0 right-4 -translate-y-1/2 bg-primary px-3 py-1 rounded-full">
                    <Text className="text-xs font-bold text-primary-foreground">
                      MOST POPULAR
                    </Text>
                  </View>
                )}

                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-2xl font-bold text-foreground">
                      {plan.name}
                    </Text>
                    <View className="flex-row items-baseline gap-1 mt-1">
                      <Text className="text-3xl font-bold text-primary">
                        {plan.price}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {plan.period}
                      </Text>
                    </View>
                    {plan.savings && (
                      <Text className="text-sm text-green-600 font-semibold mt-1">
                        {plan.savings}
                      </Text>
                    )}
                  </View>

                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <View className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </View>
                </View>

                <View className="gap-2">
                  {plan.features.map((feature, index) => (
                    <View key={index} className="flex-row items-center gap-2">
                      <Text className="text-primary">✓</Text>
                      <Text className="text-sm text-foreground flex-1">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Benefits */}
          <View className="bg-muted rounded-lg p-4 mb-6">
            <View className="flex-row flex-wrap gap-4">
              {benefits.map((benefit, index) => (
                <View key={index} className="flex-row items-center gap-2">
                  <Text className="text-xl">{benefit.icon}</Text>
                  <Text className="text-sm text-foreground">{benefit.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={selectedPlan === "free"}
            className={`rounded-lg p-4 items-center mb-4 ${
              selectedPlan === "free" ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text
              className={`text-base font-bold ${
                selectedPlan === "free"
                  ? "text-muted-foreground"
                  : "text-primary-foreground"
              }`}
            >
              {selectedPlan === "free"
                ? "Current Plan"
                : `Continue with ${plans.find((p) => p.id === selectedPlan)?.name}`}
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text className="text-xs text-muted-foreground text-center">
            By subscribing, you agree to our Terms of Service and Privacy
            Policy. Cancel anytime.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
