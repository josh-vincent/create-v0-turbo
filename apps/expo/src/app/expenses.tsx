import { Stack } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function ExpensesScreen() {
  const expenses = [
    {
      id: "1",
      category: "Office Supplies",
      amount: "$125.50",
      date: "2025-10-05",
      vendor: "Office Depot",
      status: "approved",
    },
    {
      id: "2",
      category: "Software",
      amount: "$49.99",
      date: "2025-10-03",
      vendor: "Adobe",
      status: "pending",
    },
    {
      id: "3",
      category: "Travel",
      amount: "$320.00",
      date: "2025-10-01",
      vendor: "United Airlines",
      status: "approved",
    },
    {
      id: "4",
      category: "Meals",
      amount: "$85.30",
      date: "2025-09-28",
      vendor: "Restaurant",
      status: "rejected",
    },
  ];

  const categories = [
    { name: "Office Supplies", icon: "📎", color: "bg-blue-500" },
    { name: "Software", icon: "💻", color: "bg-purple-500" },
    { name: "Travel", icon: "✈️", color: "bg-green-500" },
    { name: "Meals", icon: "🍽️", color: "bg-orange-500" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-600";
      case "pending":
        return "bg-orange-500/20 text-orange-600";
      case "rejected":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount.replace(/[$,]/g, "")),
    0,
  );

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Expenses" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Expenses
            </Text>
            <Text className="text-base text-muted-foreground">
              Track and categorize your business expenses
            </Text>
          </View>

          {/* Total Expenses Card */}
          <View className="bg-card border border-border rounded-lg p-4 mb-6">
            <Text className="text-sm text-muted-foreground mb-1">
              Total This Month
            </Text>
            <Text className="text-3xl font-bold text-primary">
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>

          {/* Categories */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Categories
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-3"
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-10 h-10 ${cat.color}/20 rounded-full items-center justify-center mr-3`}
                    >
                      <Text className="text-xl">{cat.icon}</Text>
                    </View>
                    <Text className="text-sm font-medium text-foreground flex-1">
                      {cat.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add Expense Button */}
          <TouchableOpacity className="bg-primary rounded-lg p-4 items-center mb-6">
            <Text className="text-base font-semibold text-primary-foreground">
              + Add New Expense
            </Text>
          </TouchableOpacity>

          {/* Expense List */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Recent Expenses
            </Text>
            <View className="space-y-3">
              {expenses.map((expense) => (
                <View
                  key={expense.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground mb-1">
                        {expense.category}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {expense.vendor}
                      </Text>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(expense.status)}`}
                    >
                      <Text className="text-xs font-semibold capitalize">
                        {expense.status}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-primary">
                      {expense.amount}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {expense.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
