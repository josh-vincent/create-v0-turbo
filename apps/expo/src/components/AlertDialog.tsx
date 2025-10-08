import type { ReactNode } from "react";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface AlertDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "destructive";
  children?: ReactNode;
}

export function AlertDialog({
  visible,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  children,
}: AlertDialogProps) {
  const confirmButtonClass =
    variant === "destructive"
      ? "bg-destructive"
      : "bg-primary";

  const confirmTextClass =
    variant === "destructive"
      ? "text-destructive-foreground"
      : "text-primary-foreground";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        <View className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm">
          {/* Title */}
          <Text className="text-xl font-bold text-foreground mb-2">
            {title}
          </Text>

          {/* Description */}
          {description && (
            <Text className="text-base text-muted-foreground mb-6">
              {description}
            </Text>
          )}

          {/* Custom content */}
          {children && <View className="mb-6">{children}</View>}

          {/* Actions */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 bg-muted rounded-lg p-3 items-center"
            >
              <Text className="text-base font-semibold text-foreground">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 ${confirmButtonClass} rounded-lg p-3 items-center`}
            >
              <Text className={`text-base font-semibold ${confirmTextClass}`}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Simpler confirmation dialog hook
export function useAlertDialog() {
  const [dialogState, setDialogState] = useState<{
    visible: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    visible: false,
    title: "",
    onConfirm: () => {},
  });

  const showDialog = (config: {
    title: string;
    description?: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }) => {
    setDialogState({ ...config, visible: true });
  };

  const hideDialog = () => {
    setDialogState((prev) => ({ ...prev, visible: false }));
  };

  const dialog = (
    <AlertDialog
      visible={dialogState.visible}
      title={dialogState.title}
      description={dialogState.description}
      variant={dialogState.variant}
      onConfirm={() => {
        dialogState.onConfirm();
        hideDialog();
      }}
      onCancel={hideDialog}
    />
  );

  return { showDialog, dialog };
}
