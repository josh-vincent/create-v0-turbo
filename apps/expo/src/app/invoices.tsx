import { Link, Stack } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {  } from "react-native-safe-area-context";

export default function InvoicesScreen() {
  const invoices = [
    {
      id: "INV-001",
      client: "Acme Corp",
      amount: "$1,250.00",
      status: "paid",
      dueDate: "2025-09-15",
      paidDate: "2025-09-10",
    },
    {
      id: "INV-002",
      client: "TechStart Inc",
      amount: "$2,800.00",
      status: "pending",
      dueDate: "2025-10-20",
      paidDate: null,
    },
    {
      id: "INV-003",
      client: "Design Studio",
      amount: "$950.00",
      status: "overdue",
      dueDate: "2025-09-25",
      paidDate: null,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-600";
      case "pending":
        return "bg-orange-500/20 text-orange-600";
      case "overdue":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);

  const pendingAmount = invoices
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, "")), 0);

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Invoices" }} />

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Invoices
            </Text>
            <Text className="text-base text-muted-foreground">
              Track and manage your invoices
            </Text>
          </View>

          {/* Summary Cards */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Total Revenue
              </Text>
              <Text className="text-2xl font-bold text-green-600">
                ${totalRevenue.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-sm text-muted-foreground mb-1">
                Pending
              </Text>
              <Text className="text-2xl font-bold text-orange-600">
                ${pendingAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Create Invoice Button */}
          <TouchableOpacity className="bg-primary rounded-lg p-4 items-center mb-6">
            <Text className="text-base font-semibold text-primary-foreground">
              + Create New Invoice
            </Text>
          </TouchableOpacity>

          {/* Invoice List */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              Recent Invoices
            </Text>
            <View className="space-y-3">
              {invoices.map((invoice) => (
                <Link key={invoice.id} href={`/invoices/${invoice.id}`} asChild>
                  <TouchableOpacity className="bg-card border border-border rounded-lg p-4">
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground mb-1">
                          {invoice.id}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {invoice.client}
                        </Text>
                      </View>
                      <View
                        className={`px-3 py-1 rounded-full ${getStatusColor(invoice.status)}`}
                      >
                        <Text className="text-xs font-semibold capitalize">
                          {invoice.status}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-2xl font-bold text-primary">
                          {invoice.amount}
                        </Text>
                        <Text className="text-xs text-muted-foreground mt-1">
                          Due: {invoice.dueDate}
                        </Text>
                      </View>
                      {invoice.paidDate && (
                        <View>
                          <Text className="text-xs text-green-600">
                            Paid: {invoice.paidDate}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
