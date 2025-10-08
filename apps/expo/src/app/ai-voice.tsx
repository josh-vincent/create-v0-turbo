import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function AIVoiceScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      // Pulse animation when recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsProcessing(true);

      // Simulate processing
      setTimeout(() => {
        setTranscript("How can I help you manage your tasks today?");
        setIsProcessing(false);

        // Simulate AI response
        setTimeout(() => {
          setResponse(
            "I can help you create tasks, set reminders, check your schedule, and more. What would you like to do?",
          );
        }, 1000);
      }, 1500);
    } else {
      // Start recording
      setIsRecording(true);
      setTranscript("");
      setResponse("");
    }
  };

  const handleClear = () => {
    setTranscript("");
    setResponse("");
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "AI Voice" }} />

      <View className="flex-1 items-center justify-center p-6">
        {/* Voice Visualizer */}
        <View className="items-center mb-12">
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
            }}
            className={`w-40 h-40 rounded-full items-center justify-center ${
              isRecording
                ? "bg-destructive/20"
                : isProcessing
                ? "bg-orange-500/20"
                : "bg-primary/20"
            }`}
          >
            <View
              className={`w-32 h-32 rounded-full items-center justify-center ${
                isRecording
                  ? "bg-destructive/30"
                  : isProcessing
                  ? "bg-orange-500/30"
                  : "bg-primary/30"
              }`}
            >
              <Text className="text-6xl">
                {isRecording ? "🎙️" : isProcessing ? "⏳" : "🤖"}
              </Text>
            </View>
          </Animated.View>

          {/* Waveform Visualization (mock) */}
          {isRecording && (
            <View className="flex-row items-center gap-1 mt-6">
              {[...Array(12)].map((_, i) => (
                <Animated.View
                  key={i}
                  className="w-1 bg-destructive rounded-full"
                  style={{
                    height: Math.random() * 40 + 10,
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Status Text */}
        <Text className="text-xl font-bold text-foreground mb-2">
          {isRecording
            ? "Listening..."
            : isProcessing
            ? "Processing..."
            : "Tap to speak"}
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-8">
          {isRecording
            ? "Speak clearly into your microphone"
            : isProcessing
            ? "Converting speech to text..."
            : "Press and hold the button to record"}
        </Text>

        {/* Transcript & Response */}
        {(transcript || response) && (
          <View className="w-full mb-8">
            {transcript && (
              <View className="bg-card border border-border rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-muted-foreground mb-2">
                  You said:
                </Text>
                <Text className="text-base text-foreground">{transcript}</Text>
              </View>
            )}

            {response && (
              <View className="bg-primary/10 border border-primary rounded-lg p-4">
                <Text className="text-sm font-semibold text-primary mb-2">
                  AI Response:
                </Text>
                <Text className="text-base text-foreground">{response}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleClear}
              className="bg-muted rounded-lg p-3 items-center mt-4"
            >
              <Text className="text-base font-semibold text-foreground">
                Clear Conversation
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Record Button */}
        <TouchableOpacity
          onPress={handleToggleRecording}
          disabled={isProcessing}
          className={`w-20 h-20 rounded-full items-center justify-center ${
            isRecording ? "bg-destructive" : "bg-primary"
          } ${isProcessing ? "opacity-50" : ""}`}
        >
          <Text className="text-3xl">{isRecording ? "⏹️" : "🎙️"}</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <View className="absolute bottom-8 left-6 right-6">
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-sm text-muted-foreground text-center">
              💡 In production, connect to speech-to-text APIs like OpenAI
              Whisper, Google Speech, or ElevenLabs
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
