import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <View className="flex-1 bg-background items-center justify-center p-6">
          <View className="bg-destructive/10 border border-destructive rounded-lg p-6 w-full max-w-sm">
            <Text className="text-2xl font-bold text-destructive mb-4">
              Something went wrong
            </Text>
            <Text className="text-base text-muted-foreground mb-6">
              {this.state.error.message}
            </Text>
            <TouchableOpacity
              onPress={this.resetError}
              className="bg-primary rounded-lg p-3 items-center"
            >
              <Text className="text-base font-semibold text-primary-foreground">
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for hooks
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <View className="bg-destructive/10 border border-destructive rounded-lg p-6 w-full max-w-sm">
        <Text className="text-2xl font-bold text-destructive mb-4">
          Oops! Something went wrong
        </Text>
        <Text className="text-base text-muted-foreground mb-6">
          {error.message}
        </Text>
        <TouchableOpacity
          onPress={resetError}
          className="bg-primary rounded-lg p-3 items-center"
        >
          <Text className="text-base font-semibold text-primary-foreground">
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
