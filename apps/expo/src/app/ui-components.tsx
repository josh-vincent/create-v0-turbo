import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@tocld/ui/button";
import { Badge } from "@tocld/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@tocld/ui/card";

export default function UIComponentsGallery() {
  const [count, setCount] = useState(0);

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "UI Components Gallery",
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 p-4">
        <Text className="text-sm text-muted-foreground mb-6">
          Showcasing native React Native components using the same shadcn/ui
          design system
        </Text>

        {/* Badge Section */}
        <Text className="text-lg font-bold text-foreground mb-3">Badges</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </View>

        {/* Button Section */}
        <Text className="text-lg font-bold text-foreground mb-3">Buttons</Text>
        <View className="gap-3 mb-6">
          <Button onPress={() => setCount(count + 1)}>
            <Text>Default Button (Pressed {count}x)</Text>
          </Button>
          <Button variant="destructive" onPress={() => console.log("Delete")}>
            <Text>Destructive</Text>
          </Button>
          <Button variant="outline" onPress={() => console.log("Outline")}>
            <Text>Outline</Text>
          </Button>
          <Button variant="secondary" onPress={() => console.log("Secondary")}>
            <Text>Secondary</Text>
          </Button>
          <Button variant="ghost" onPress={() => console.log("Ghost")}>
            <Text>Ghost</Text>
          </Button>
          <Button variant="link" onPress={() => console.log("Link")}>
            <Text>Link</Text>
          </Button>
        </View>

        <View className="flex-row gap-3 mb-6">
          <Button size="sm" className="flex-1">
            <Text>Small</Text>
          </Button>
          <Button size="default" className="flex-1">
            <Text>Default</Text>
          </Button>
          <Button size="lg" className="flex-1">
            <Text>Large</Text>
          </Button>
        </View>

        {/* Card Section */}
        <Text className="text-lg font-bold text-foreground mb-3">Cards</Text>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>
              This is a card description explaining what the card contains.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Text className="text-sm text-foreground">
              Card content goes here. This demonstrates the native Card
              component working with NativeWind styling, using the same design
              tokens as shadcn/ui.
            </Text>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>
            <CardDescription>With buttons and badges</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row gap-2 mb-3">
              <Badge variant="success">Active</Badge>
              <Badge variant="info">Premium</Badge>
            </View>
            <Text className="text-sm text-muted-foreground mb-4">
              This card combines multiple components to show how they work
              together seamlessly.
            </Text>
          </CardContent>
          <CardFooter>
            <Button className="flex-1" variant="outline">
              <Text>Cancel</Text>
            </Button>
            <Button className="flex-1 ml-2">
              <Text>Confirm</Text>
            </Button>
          </CardFooter>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <View className="flex-row items-center justify-between">
              <CardTitle>Status Card</CardTitle>
              <Badge variant="warning">Pending</Badge>
            </View>
            <CardDescription>Example with badge in header</CardDescription>
          </CardHeader>
          <CardContent>
            <Text className="text-sm text-foreground">
              You can compose components freely to create custom layouts.
            </Text>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardHeader>
            <CardTitle>💡 Design System Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-xs text-muted-foreground mb-2">
              ✅ Same components as Next.js app (shadcn/ui)
            </Text>
            <Text className="text-xs text-muted-foreground mb-2">
              ✅ Automatic platform resolution (.native.tsx)
            </Text>
            <Text className="text-xs text-muted-foreground mb-2">
              ✅ Shared CVA variants across web and native
            </Text>
            <Text className="text-xs text-muted-foreground">
              ✅ NativeWind v4 for consistent styling
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
