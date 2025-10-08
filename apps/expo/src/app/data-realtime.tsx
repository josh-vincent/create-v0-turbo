import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "~/utils/auth";

interface Message {
  id: string;
  content: string;
  user_id: string;
  username: string;
  created_at: string;
}

export default function RealtimeDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    // Fetch initial messages (simulated - would be real Supabase query)
    const fetchMessages = async () => {
      try {
        // In production: const { data } = await supabase.from('messages').select('*').order('created_at')
        setMessages([
          {
            id: "1",
            content: "Welcome to the realtime demo!",
            user_id: "system",
            username: "System",
            created_at: new Date(Date.now() - 60000).toISOString(),
          },
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (!isJoined) return;

    // Subscribe to realtime changes
    // In production, this would be a real Supabase channel subscription
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Handle new message
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [isJoined]);

  const handleJoin = () => {
    if (!username.trim()) return;
    setIsJoined(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Simulate sending message (in production, would insert to Supabase)
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      user_id: "demo-user",
      username: username,
      created_at: new Date().toISOString(),
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // In production: await supabase.from('messages').insert(message)
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.username === username;
    const timeStr = new Date(item.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        className={`mb-3 ${isOwnMessage ? "items-end" : "items-start"}`}
      >
        <View
          className={`max-w-[80%] rounded-lg p-3 ${
            isOwnMessage
              ? "bg-primary"
              : item.user_id === "system"
                ? "bg-muted"
                : "bg-card border border-border"
          }`}
        >
          {!isOwnMessage && (
            <Text
              className={`text-xs font-semibold mb-1 ${
                item.user_id === "system"
                  ? "text-muted-foreground"
                  : "text-primary"
              }`}
            >
              {item.username}
            </Text>
          )}
          <Text
            className={`text-base ${
              isOwnMessage
                ? "text-primary-foreground"
                : "text-foreground"
            }`}
          >
            {item.content}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isOwnMessage
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            }`}
          >
            {timeStr}
          </Text>
        </View>
      </View>
    );
  };

  if (!isJoined) {
    return (
      <View style={{ flex: 1 }} className="bg-background">
        <Stack.Screen
          options={{
            title: "Realtime Demo",
            headerShadowVisible: false,
          }}
        />

        <View className="flex-1 px-4 py-4 justify-center">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground mb-2 text-center">
              🔴 Realtime Chat
            </Text>
            <Text className="text-base text-muted-foreground text-center">
              Join the realtime demo to see Supabase subscriptions in action
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-base font-semibold text-foreground mb-2">
                Your Username
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name..."
                placeholderTextColor="#9ca3af"
                className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                autoCapitalize="words"
              />
            </View>

            <TouchableOpacity
              onPress={handleJoin}
              disabled={!username.trim()}
              className={`rounded-lg py-3 items-center ${
                !username.trim() ? "bg-muted" : "bg-primary"
              }`}
            >
              <Text className="text-base font-semibold text-primary-foreground">
                Join Chat
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-muted/50 border border-border rounded-lg p-4 mt-8">
            <Text className="text-base font-semibold text-foreground mb-2">
              💡 Realtime Features
            </Text>
            <Text className="text-sm text-muted-foreground mb-1">
              • Supabase Realtime subscriptions
            </Text>
            <Text className="text-sm text-muted-foreground mb-1">
              • postgres_changes event listening
            </Text>
            <Text className="text-sm text-muted-foreground mb-1">
              • Live updates across devices
            </Text>
            <Text className="text-sm text-muted-foreground">
              • Optimistic UI updates
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "Realtime Chat",
          headerShadowVisible: false,
        }}
      />

      {/* Connection Status */}
      <View
        className={`px-4 py-2 ${
          isConnected ? "bg-green-500/20" : "bg-yellow-500/20"
        }`}
      >
        <View className="flex-row items-center justify-center gap-2">
          <View
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <Text
            className={`text-sm font-medium ${
              isConnected ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {isConnected ? "Connected" : "Connecting..."}
          </Text>
        </View>
      </View>

      {/* Messages List */}
      <View className="flex-1 px-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text className="text-muted-foreground mt-2">
              Loading messages...
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-muted-foreground">
                  No messages yet. Be the first to say hello!
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Message Input */}
      <View className="px-4 py-3 border-t border-border bg-background">
        <View className="flex-row gap-2">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-card border border-border rounded-lg px-4 py-2 text-base text-foreground"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`rounded-lg px-4 py-2 items-center justify-center ${
              !newMessage.trim() ? "bg-muted" : "bg-primary"
            }`}
          >
            <Text className="text-2xl">📤</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-muted-foreground mt-1">
          Logged in as {username}
        </Text>
      </View>
    </View>
  );
}
