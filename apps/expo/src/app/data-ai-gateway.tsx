import { useMutation } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { trpc } from "~/utils/api";

type AIModel = "openai/gpt-4o" | "anthropic/claude-sonnet-4" | "xai/grok-4";

export default function AIGatewayDemo() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>("openai/gpt-4o");
  const [responses, setResponses] = useState<
    Array<{ prompt: string; text: string; model: string; tokens: number }>
  >([]);

  const generateMutation = useMutation(
    trpc.demo.generateText.mutationOptions({
      onSuccess: (data) => {
        setResponses((prev) => [
          { prompt, text: data.text, model: data.model, tokens: data.tokens },
          ...prev,
        ]);
        setPrompt("");
      },
    })
  );

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generateMutation.mutate({
      prompt: prompt.trim(),
      model: selectedModel,
    });
  };

  const models: Array<{ value: AIModel; label: string; icon: string }> = [
    { value: "openai/gpt-4o", label: "GPT-4o", icon: "🤖" },
    { value: "anthropic/claude-sonnet-4", label: "Claude Sonnet 4", icon: "🧠" },
    { value: "xai/grok-4", label: "Grok 4", icon: "⚡" },
  ];

  const charactersRemaining = 500 - prompt.length;

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "AI Gateway Demo",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">
            Vercel AI Gateway Demo
          </Text>
          <Text className="text-sm text-muted-foreground">
            Generate AI completions using multiple models through Vercel's unified
            AI Gateway API.
          </Text>
        </View>

        {/* Model Selector */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-foreground mb-3">
            Select Model
          </Text>
          <View className="flex-row gap-2">
            {models.map((model) => (
              <TouchableOpacity
                key={model.value}
                onPress={() => setSelectedModel(model.value)}
                className={`flex-1 py-3 rounded-lg border ${
                  selectedModel === model.value
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
              >
                <Text
                  className={`text-center text-lg mb-1 ${
                    selectedModel === model.value
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {model.icon}
                </Text>
                <Text
                  className={`text-center text-xs font-medium ${
                    selectedModel === model.value
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {model.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prompt Input */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-foreground">
              Your Prompt
            </Text>
            <Text
              className={`text-sm ${
                charactersRemaining < 50
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {charactersRemaining} chars left
            </Text>
          </View>

          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt here..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
            className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground min-h-[120px]"
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleGenerate}
            disabled={!prompt.trim() || generateMutation.isPending}
            className={`mt-3 rounded-lg py-3 items-center ${
              !prompt.trim() || generateMutation.isPending
                ? "bg-muted"
                : "bg-primary"
            }`}
          >
            {generateMutation.isPending ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-base font-semibold text-primary-foreground">
                  Generating...
                </Text>
              </View>
            ) : (
              <Text className="text-base font-semibold text-primary-foreground">
                Generate with {models.find((m) => m.value === selectedModel)?.label}
              </Text>
            )}
          </TouchableOpacity>

          {generateMutation.error && (
            <View className="mt-3 bg-destructive/10 border border-destructive rounded-lg p-3">
              <Text className="text-destructive text-sm">
                Error: {generateMutation.error.message}
              </Text>
            </View>
          )}
        </View>

        {/* Responses History */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Responses ({responses.length})
          </Text>

          {responses.length === 0 ? (
            <View className="bg-muted/50 border border-border rounded-lg p-6">
              <Text className="text-center text-muted-foreground">
                No responses yet. Enter a prompt above to get started!
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {responses.map((response, index) => (
                <View
                  key={index}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  {/* Response Header */}
                  <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-border">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg">
                        {models.find((m) => m.value === response.model)?.icon}
                      </Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {models.find((m) => m.value === response.model)?.label}
                      </Text>
                    </View>
                    <View className="bg-primary/20 px-2 py-1 rounded">
                      <Text className="text-xs font-medium text-primary">
                        {response.tokens} tokens
                      </Text>
                    </View>
                  </View>

                  {/* Original Prompt */}
                  <View className="mb-3">
                    <Text className="text-xs font-semibold text-muted-foreground mb-1">
                      PROMPT
                    </Text>
                    <Text className="text-sm text-foreground italic">
                      "{response.prompt}"
                    </Text>
                  </View>

                  {/* AI Response */}
                  <View>
                    <Text className="text-xs font-semibold text-muted-foreground mb-1">
                      RESPONSE
                    </Text>
                    <Text className="text-sm text-foreground leading-5">
                      {response.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info Section */}
        <View className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            💡 Features Demonstrated
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Vercel AI Gateway unified API
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Multiple model providers (OpenAI, Anthropic, xAI)
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • tRPC mutations for AI calls
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Character limit validation
          </Text>
          <Text className="text-sm text-muted-foreground">
            • Response history with token tracking
          </Text>
        </View>

        {/* Setup Note */}
        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <Text className="text-base font-semibold text-yellow-900 mb-2">
            ⚠️ Setup Required
          </Text>
          <Text className="text-sm text-yellow-800">
            This demo currently returns mock responses. To enable real AI completions:
            {"\n\n"}
            1. Set up Vercel AI Gateway
            {"\n"}
            2. Add AI_GATEWAY_API_KEY to .env
            {"\n"}
            3. Uncomment production code in demo router
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
