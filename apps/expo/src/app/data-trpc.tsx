import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";

type Product = RouterOutputs["demo"]["getProducts"][number];

export default function TRPCDataDemo() {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<string>("all");
  const [stockQuantity, setStockQuantity] = useState("");

  // Query: Get all products
  const productsQuery = useQuery(trpc.demo.getProducts.queryOptions());

  // Query: Search products
  const searchQuery2 = useQuery(
    trpc.demo.searchProducts.queryOptions({
      query: searchQuery,
      category: searchCategory === "all" ? undefined : searchCategory,
    })
  );

  // Mutation: Update stock with optimistic updates
  const updateStockMutation = useMutation(
    trpc.demo.updateStock.mutationOptions({
      onMutate: async (variables) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(trpc.demo.getProducts.queryFilter());

        // Snapshot previous value
        const previousProducts = queryClient.getQueryData(
          trpc.demo.getProducts.queryKey()
        );

        // Optimistically update cache
        queryClient.setQueryData(
          trpc.demo.getProducts.queryKey(),
          (old: Product[] | undefined) => {
            if (!old) return old;
            return old.map((p) =>
              p.id === variables.id ? { ...p, stock: variables.quantity } : p
            );
          }
        );

        return { previousProducts };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previousProducts) {
          queryClient.setQueryData(
            trpc.demo.getProducts.queryKey(),
            context.previousProducts
          );
        }
      },
      onSettled: () => {
        // Refetch after mutation
        queryClient.invalidateQueries(trpc.demo.getProducts.queryFilter());
      },
    })
  );

  const handleUpdateStock = () => {
    if (!selectedProduct || !stockQuantity) return;

    const quantity = parseInt(stockQuantity, 10);
    if (isNaN(quantity)) return;

    updateStockMutation.mutate({
      id: selectedProduct.id,
      quantity,
    });

    setStockQuantity("");
    setSelectedProduct(null);
  };

  const categories = ["all", "Electronics", "Accessories"];

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen
        options={{
          title: "tRPC Data Fetching",
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl
            refreshing={productsQuery.isRefetching}
            onRefresh={() => productsQuery.refetch()}
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">
            tRPC Data Fetching Demo
          </Text>
          <Text className="text-sm text-muted-foreground">
            Demonstrates tRPC queries, mutations, optimistic updates, and cache
            management. Pull to refresh!
          </Text>
        </View>

        {/* Search Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Search Products
          </Text>

          {/* Category Filter */}
          <View className="flex-row gap-2 mb-3">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSearchCategory(cat)}
                className={`px-4 py-2 rounded-lg ${
                  searchCategory === cat
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    searchCategory === cat
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Input */}
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name..."
            placeholderTextColor="#9ca3af"
            className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
          />

          {/* Search Results */}
          {searchQuery.trim() && (
            <View className="mt-3">
              {searchQuery2.isLoading ? (
                <ActivityIndicator size="small" />
              ) : searchQuery2.data && searchQuery2.data.length > 0 ? (
                <View className="space-y-2">
                  <Text className="text-sm text-muted-foreground">
                    Found {searchQuery2.data.length} result(s)
                  </Text>
                  {searchQuery2.data.map((product) => (
                    <View
                      key={product.id}
                      className="bg-card border border-border rounded-lg p-3"
                    >
                      <Text className="text-base font-semibold text-foreground">
                        {product.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {product.category} • ${product.price} • {product.stock}{" "}
                        in stock
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-muted-foreground">
                  No products found
                </Text>
              )}
            </View>
          )}
        </View>

        {/* All Products Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            All Products
          </Text>

          {productsQuery.isLoading ? (
            <View className="bg-card border border-border rounded-lg p-6">
              <ActivityIndicator size="large" />
              <Text className="text-center text-muted-foreground mt-2">
                Loading products...
              </Text>
            </View>
          ) : productsQuery.error ? (
            <View className="bg-destructive/10 border border-destructive rounded-lg p-4">
              <Text className="text-destructive font-semibold mb-2">Error</Text>
              <Text className="text-destructive/80 text-sm mb-3">
                {productsQuery.error.message}
              </Text>
              <TouchableOpacity
                onPress={() => productsQuery.refetch()}
                className="bg-destructive rounded-md px-4 py-2"
              >
                <Text className="text-destructive-foreground text-center font-semibold">
                  Retry
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-3">
              {productsQuery.data?.map((product) => (
                <View
                  key={product.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">
                        {product.name}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {product.category}
                      </Text>
                    </View>
                    <Text className="text-lg font-bold text-primary">
                      ${product.price}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <View
                        className={`px-2 py-1 rounded ${
                          product.stock > 20
                            ? "bg-green-100"
                            : product.stock > 10
                              ? "bg-yellow-100"
                              : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            product.stock > 20
                              ? "text-green-700"
                              : product.stock > 10
                                ? "text-yellow-700"
                                : "text-red-700"
                          }`}
                        >
                          {product.stock} in stock
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => setSelectedProduct(product)}
                      className="bg-primary rounded-md px-3 py-1.5"
                    >
                      <Text className="text-xs font-medium text-primary-foreground">
                        Update Stock
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Update Stock Modal */}
        {selectedProduct && (
          <View className="mb-6 bg-card border border-border rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Update Stock: {selectedProduct.name}
            </Text>

            <Text className="text-sm text-muted-foreground mb-2">
              Current stock: {selectedProduct.stock}
            </Text>

            <TextInput
              value={stockQuantity}
              onChangeText={setStockQuantity}
              placeholder="Enter new quantity"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              className="bg-background border border-border rounded-lg px-4 py-3 text-base text-foreground mb-3"
            />

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleUpdateStock}
                disabled={updateStockMutation.isPending}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                {updateStockMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-semibold text-primary-foreground">
                    Update
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedProduct(null);
                  setStockQuantity("");
                }}
                className="flex-1 bg-muted rounded-lg py-3 items-center"
              >
                <Text className="text-base font-semibold text-foreground">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

            {updateStockMutation.error && (
              <Text className="text-destructive text-sm mt-2">
                Error: {updateStockMutation.error.message}
              </Text>
            )}
          </View>
        )}

        {/* Info Section */}
        <View className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            💡 Features Demonstrated
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • tRPC queries with type safety
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Mutations with optimistic updates
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Cache invalidation and refetching
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Pull-to-refresh
          </Text>
          <Text className="text-sm text-muted-foreground mb-1">
            • Error handling and retry
          </Text>
          <Text className="text-sm text-muted-foreground">
            • Mock mode fallback
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
