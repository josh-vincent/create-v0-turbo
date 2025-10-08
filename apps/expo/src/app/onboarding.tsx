import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {  } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Welcome to Create V0 Turbo",
    description:
      "A powerful starter template with everything you need to build modern mobile apps",
    icon: "👋",
    color: "bg-blue-500/20",
  },
  {
    id: "2",
    title: "AI-Powered Features",
    description:
      "Chat with AI, generate images, and use voice commands to boost your productivity",
    icon: "🤖",
    color: "bg-purple-500/20",
  },
  {
    id: "3",
    title: "Track & Manage",
    description:
      "Keep track of tasks, expenses, time, and invoices all in one place",
    icon: "📊",
    color: "bg-green-500/20",
  },
  {
    id: "4",
    title: "Stay Connected",
    description:
      "Integrate with your favorite apps and services seamlessly",
    icon: "🔗",
    color: "bg-orange-500/20",
  },
  {
    id: "5",
    title: "Get Started",
    description:
      "Everything is ready. Let's create something amazing together!",
    icon: "🚀",
    color: "bg-pink-500/20",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // In production: Save onboarding completion to AsyncStorage
    router.replace("/");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={{ width }} className="flex-1 items-center justify-center p-8">
      <View className={`w-40 h-40 rounded-full items-center justify-center mb-8 ${item.color}`}>
        <Text className="text-8xl">{item.icon}</Text>
      </View>

      <Text className="text-3xl font-bold text-foreground text-center mb-4">
        {item.title}
      </Text>

      <Text className="text-base text-muted-foreground text-center max-w-sm">
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          onPress={handleSkip}
          className="absolute top-12 right-6 z-10 px-4 py-2 bg-muted rounded-full"
        >
          <Text className="text-sm font-semibold text-foreground">Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={32}
      />

      {/* Bottom Section */}
      <View className="pb-8 px-6">
        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center mb-6">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary rounded-lg p-4 items-center"
        >
          <Text className="text-base font-bold text-primary-foreground">
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Back Button (except first slide) */}
        {currentIndex > 0 && (
          <TouchableOpacity
            onPress={() => {
              const prevIndex = currentIndex - 1;
              flatListRef.current?.scrollToIndex({
                index: prevIndex,
                animated: true,
              });
              setCurrentIndex(prevIndex);
            }}
            className="mt-3 p-3 items-center"
          >
            <Text className="text-sm font-semibold text-muted-foreground">
              Back
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
