import { Stack } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {  } from "react-native-safe-area-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userInput: string): string => {
    // Mock AI responses based on input
    const responses: Record<string, string> = {
      hello:
        "Hello! I'm your AI assistant. How can I help you today?",
      help: "I can help you with tasks, answer questions, provide information, and more. What would you like to know?",
      features:
        "I can help you manage tasks, analyze data, generate content, and provide insights. What specific feature interests you?",
      default:
        "I understand you're asking about that. In a production app, I would connect to an AI service like OpenAI, Anthropic, or Google AI to provide intelligent responses.",
    };

    const lowerInput = userInput.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "AI Chat" }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={({ item }) => (
            <View
              className={`mb-4 ${item.role === "user" ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[80%] rounded-2xl p-4 ${
                  item.role === "user"
                    ? "bg-primary"
                    : "bg-card border border-border"
                }`}
              >
                <Text
                  className={`text-base ${
                    item.role === "user"
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.content}
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground mt-1 px-2">
                {item.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">🤖</Text>
              </View>
              <Text className="text-xl font-bold text-foreground mb-2">
                AI Assistant
              </Text>
              <Text className="text-base text-muted-foreground text-center px-8">
                Ask me anything! I'm here to help with tasks, questions, and more.
              </Text>
            </View>
          }
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View className="px-4 pb-2">
            <View className="flex-row items-center bg-card border border-border rounded-2xl p-4 max-w-[60%]">
              <View className="flex-row gap-1">
                <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <View
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <View
                  className="w-2 h-2 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </View>
              <Text className="text-sm text-muted-foreground ml-3">
                AI is typing...
              </Text>
            </View>
          </View>
        )}

        {/* Input Bar */}
        <View className="border-t border-border bg-background p-4">
          <View className="flex-row items-center gap-3">
            <View className="flex-1 bg-card border border-border rounded-full px-4 py-3 flex-row items-center">
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base text-foreground"
                multiline={false}
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                input.trim() && !isTyping ? "bg-primary" : "bg-muted"
              }`}
            >
              <Text className="text-xl">
                {isTyping ? "⏳" : "➤"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            <View className="flex-row gap-2">
              {["Help", "Features", "Examples", "Clear"].map((action) => (
                <TouchableOpacity
                  key={action}
                  onPress={() => {
                    if (action === "Clear") {
                      setMessages([]);
                    } else {
                      setInput(action);
                    }
                  }}
                  className="bg-muted border border-border rounded-full px-4 py-2"
                >
                  <Text className="text-sm font-medium text-foreground">
                    {action}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
