import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Animated, Modal, PanResponder, TouchableOpacity, View } from "react-native";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  height = 400,
}: BottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height, slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="flex-1 justify-end">
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-background rounded-t-3xl border-t border-border"
            {...panResponder.panHandlers}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Drag handle */}
              <View className="items-center py-3">
                <View className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              </View>

              {/* Content */}
              <View style={{ height }} className="px-6 pb-6">
                {children}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

interface FullScreenModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function FullScreenModal({
  visible,
  onClose,
  children,
  title,
}: FullScreenModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="bg-primary px-6 pt-12 pb-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center"
          >
            <View className="text-2xl text-primary-foreground">←</View>
          </TouchableOpacity>
          {title && (
            <View className="text-lg font-semibold text-primary-foreground">
              {title}
            </View>
          )}
          <View className="w-10" />
        </View>

        {/* Content */}
        <View className="flex-1">{children}</View>
      </View>
    </Modal>
  );
}
