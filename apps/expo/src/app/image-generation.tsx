import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {  } from "react-native-safe-area-context";

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  timestamp: Date;
}

export default function ImageGenerationScreen() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState("realistic");

  const styles = [
    { id: "realistic", name: "Realistic", icon: "📷" },
    { id: "artistic", name: "Artistic", icon: "🎨" },
    { id: "anime", name: "Anime", icon: "🎭" },
    { id: "3d", name: "3D Render", icon: "🧊" },
  ];

  const examplePrompts = [
    "A serene mountain landscape at sunset",
    "Futuristic city with flying cars",
    "Cute robot playing with butterflies",
    "Abstract geometric patterns in pastel colors",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate image generation (replace with actual AI API)
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        url: `https://picsum.photos/seed/${Date.now()}/800/600`, // Placeholder
        timestamp: new Date(),
      };

      setGeneratedImages((prev) => [newImage, ...prev]);
      setIsGenerating(false);
      setPrompt("");
    }, 3000);
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "AI Image Generation" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Create AI Art
            </Text>
            <Text className="text-base text-muted-foreground">
              Generate images from text descriptions
            </Text>
          </View>

          {/* Prompt Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Describe your image
            </Text>
            <View className="bg-card border border-border rounded-lg p-4">
              <TextInput
                value={prompt}
                onChangeText={setPrompt}
                placeholder="A beautiful sunset over the ocean..."
                placeholderTextColor="#9ca3af"
                className="text-base text-foreground min-h-[80px]"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Style Selection */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Art Style
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {styles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  onPress={() => setSelectedStyle(style.id)}
                  className={`flex-1 min-w-[45%] border-2 rounded-lg p-3 ${
                    selectedStyle === style.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <Text className="text-2xl mb-1">{style.icon}</Text>
                  <Text
                    className={`text-sm font-medium ${
                      selectedStyle === style.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {style.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`rounded-lg p-4 items-center mb-6 ${
              !prompt.trim() || isGenerating ? "bg-muted" : "bg-primary"
            }`}
          >
            {isGenerating ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#fff" />
                <Text className="text-base font-semibold text-white">
                  Generating...
                </Text>
              </View>
            ) : (
              <Text className="text-base font-semibold text-primary-foreground">
                ✨ Generate Image
              </Text>
            )}
          </TouchableOpacity>

          {/* Example Prompts */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Example Prompts
            </Text>
            <View className="gap-2">
              {examplePrompts.map((example, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setPrompt(example)}
                  className="bg-muted border border-border rounded-lg p-3"
                >
                  <Text className="text-sm text-foreground">{example}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
                Generated Images
              </Text>
              <View className="gap-4">
                {generatedImages.map((img) => (
                  <View
                    key={img.id}
                    className="bg-card border border-border rounded-lg overflow-hidden"
                  >
                    <Image
                      source={{ uri: img.url }}
                      className="w-full h-64"
                      resizeMode="cover"
                    />
                    <View className="p-4">
                      <Text className="text-sm text-muted-foreground mb-2">
                        {img.timestamp.toLocaleString()}
                      </Text>
                      <Text className="text-base text-foreground">
                        "{img.prompt}"
                      </Text>
                      <View className="flex-row gap-2 mt-3">
                        <TouchableOpacity className="flex-1 bg-primary rounded-lg p-2 items-center">
                          <Text className="text-sm font-semibold text-primary-foreground">
                            Download
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-muted rounded-lg p-2 items-center">
                          <Text className="text-sm font-semibold text-foreground">
                            Share
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Info Card */}
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-sm text-muted-foreground text-center">
              💡 Connect to DALL-E, Midjourney, Stable Diffusion, or other AI
              image generation APIs in production
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
