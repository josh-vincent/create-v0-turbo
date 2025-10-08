import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="items-center max-w-sm">
        {/* Icon */}
        <Text className="text-6xl mb-4">{icon}</Text>

        {/* Title */}
        <Text className="text-2xl font-bold text-foreground text-center mb-2">
          {title}
        </Text>

        {/* Description */}
        {description && (
          <Text className="text-base text-muted-foreground text-center mb-6">
            {description}
          </Text>
        )}

        {/* Custom content */}
        {children}

        {/* Action button */}
        {actionLabel && onAction && (
          <TouchableOpacity
            onPress={onAction}
            className="bg-primary rounded-lg px-6 py-3 mt-4"
          >
            <Text className="text-base font-semibold text-primary-foreground">
              {actionLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Preset empty states for common use cases
export function NoDataEmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon="📊"
      title="No data available"
      description="There's nothing to show here yet"
      actionLabel={onRefresh ? "Refresh" : undefined}
      onAction={onRefresh}
    />
  );
}

export function NoResultsEmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search or filters"
      actionLabel={onClear ? "Clear filters" : undefined}
      onAction={onClear}
    />
  );
}

export function NoConnectionEmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon="📡"
      title="No connection"
      description="Unable to connect to the server. Please check your internet connection."
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}

export function NotFoundEmptyState({ onGoBack }: { onGoBack?: () => void }) {
  return (
    <EmptyState
      icon="🤷"
      title="Not found"
      description="The item you're looking for doesn't exist or has been removed."
      actionLabel={onGoBack ? "Go back" : undefined}
      onAction={onGoBack}
    />
  );
}
