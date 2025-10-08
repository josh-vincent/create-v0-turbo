import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {  } from "react-native-safe-area-context";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  status: "active" | "inactive" | "prospect" | "customer";
  phone?: string;
}

export default function CustomersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Mock customer data - replace with tRPC query
  const mockCustomers: Customer[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      company: "Acme Inc",
      status: "customer",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@techcorp.com",
      company: "TechCorp",
      status: "prospect",
      phone: "+1 (555) 987-6543",
    },
    {
      id: "3",
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@startup.io",
      company: "Startup.io",
      status: "active",
      phone: "+1 (555) 456-7890",
    },
    {
      id: "4",
      firstName: "Alice",
      lastName: "Williams",
      email: "alice@consulting.com",
      company: "Consulting Co",
      status: "customer",
      phone: "+1 (555) 321-0987",
    },
    {
      id: "5",
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie@agency.com",
      company: "Creative Agency",
      status: "prospect",
      phone: "+1 (555) 654-3210",
    },
  ];

  // Filter customers based on search and status
  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      searchQuery === "" ||
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || customer.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "customer":
        return "bg-green-500";
      case "prospect":
        return "bg-blue-500";
      case "active":
        return "bg-purple-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <TouchableOpacity className="bg-card border border-border rounded-lg p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-foreground">
            {item.firstName} {item.lastName}
          </Text>
          {item.company && (
            <Text className="text-sm text-muted-foreground mt-1">
              {item.company}
            </Text>
          )}
        </View>
        <View
          className={`${getStatusColor(item.status)} px-3 py-1 rounded-full`}
        >
          <Text className="text-xs font-medium text-white capitalize">
            {item.status}
          </Text>
        </View>
      </View>

      <View className="space-y-1">
        <View className="flex-row items-center">
          <Text className="text-sm text-foreground">📧 {item.email}</Text>
        </View>
        {item.phone && (
          <View className="flex-row items-center">
            <Text className="text-sm text-foreground">📱 {item.phone}</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-end gap-2 mt-3 pt-3 border-t border-border">
        <TouchableOpacity
          onPress={() => router.push(`/customer-detail?id=${item.id}`)}
          className="px-3 py-2 bg-primary rounded-md"
        >
          <Text className="text-xs font-medium text-primary-foreground">
            View Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-3 py-2 bg-muted rounded-md">
          <Text className="text-xs font-medium text-foreground">Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Customers" }} />

      <View className="flex-1 px-4">
        {/* Search Bar */}
        <View className="py-4">
          <View className="flex-row items-center bg-card border border-border rounded-lg px-4 py-3">
            <Text className="text-xl mr-2">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search customers..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-foreground"
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text className="text-lg text-muted-foreground">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Status Filter */}
        <View className="mb-4">
          <View className="flex-row gap-2">
            {["all", "customer", "prospect", "active", "inactive"].map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedStatus === status
                      ? "bg-primary border-primary"
                      : "bg-muted border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${
                      selectedStatus === status
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Results Count */}
        <View className="mb-3">
          <Text className="text-sm text-muted-foreground">
            {filteredCustomers.length} customer
            {filteredCustomers.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        {/* Customer List */}
        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-4">
                <Text className="text-4xl">👥</Text>
              </View>
              <Text className="text-xl font-bold text-foreground mb-2">
                No Customers Found
              </Text>
              <Text className="text-base text-muted-foreground text-center px-8">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Add your first customer to get started"}
              </Text>
            </View>
          }
        />

        {/* Add Customer FAB */}
        <TouchableOpacity
          onPress={() => router.push("/customer-add")}
          className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-2xl text-primary-foreground">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
