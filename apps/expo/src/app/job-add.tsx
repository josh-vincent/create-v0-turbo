import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
}

export default function AddJobScreen() {
  const router = useRouter();
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form fields
  const [jobNumber, setJobNumber] = useState(`JOB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`);
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  // Mock customers
  const mockCustomers: Customer[] = [
    { id: "1", name: "John Doe", email: "john@acme.com", company: "Acme Inc" },
    { id: "2", name: "Jane Smith", email: "jane@techcorp.com", company: "TechCorp" },
    { id: "3", name: "Bob Johnson", email: "bob@startup.io", company: "Startup.io" },
  ];

  const filteredCustomers = mockCustomers.filter((customer) =>
    customerSearch === "" ||
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.company?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCustomerSearch("");
  };

  const handleSubmit = () => {
    if (!selectedCustomer) {
      Alert.alert("Error", "Please select a customer");
      return;
    }

    if (!jobNumber.trim()) {
      Alert.alert("Error", "Please enter a job number");
      return;
    }

    // TODO: Integrate with tRPC mutation
    Alert.alert("Success", "Job created successfully!", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Create Job", headerShadowVisible: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView className="flex-1 px-4 py-4">
          {/* Customer Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Customer *
            </Text>

            {selectedCustomer ? (
              <View className="bg-card border border-border rounded-lg p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {selectedCustomer.name}
                    </Text>
                    {selectedCustomer.company && (
                      <Text className="text-sm text-muted-foreground mt-1">
                        {selectedCustomer.company}
                      </Text>
                    )}
                    <Text className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.email}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedCustomer(null)}
                    className="bg-red-500 rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Text className="text-white">✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowCustomerSearch(true)}
                className="bg-card border-2 border-dashed border-border rounded-lg p-6 items-center"
              >
                <Text className="text-4xl mb-2">👥</Text>
                <Text className="text-base font-medium text-foreground">
                  Select Customer
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Tap to search and select
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Job Number */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Job Details
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">
                Job Number *
              </Text>
              <TextInput
                value={jobNumber}
                onChangeText={setJobNumber}
                placeholder="JOB-2024-001"
                placeholderTextColor="#9ca3af"
                className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">
                Contact Person
              </Text>
              <TextInput
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="John Doe"
                placeholderTextColor="#9ca3af"
                className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground mb-2">
                Contact Number
              </Text>
              <TextInput
                value={contactNumber}
                onChangeText={setContactNumber}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />
            </View>
          </View>

          {/* Address */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Job Location
            </Text>

            <View className="space-y-4">
              <TextInput
                value={addressLine1}
                onChangeText={setAddressLine1}
                placeholder="Address Line 1"
                placeholderTextColor="#9ca3af"
                className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />

              <TextInput
                value={addressLine2}
                onChangeText={setAddressLine2}
                placeholder="Address Line 2"
                placeholderTextColor="#9ca3af"
                className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />

              <View className="flex-row gap-3">
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="City"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
                <TextInput
                  value={state}
                  onChangeText={setState}
                  placeholder="State"
                  placeholderTextColor="#9ca3af"
                  className="w-24 bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <TextInput
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="Postal Code"
                placeholderTextColor="#9ca3af"
                className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
              />
            </View>
          </View>

          {/* Job Specifics */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Job Specifics
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Equipment Type
                </Text>
                <TextInput
                  value={equipmentType}
                  onChangeText={setEquipmentType}
                  placeholder="e.g., Excavator, Bulldozer"
                  placeholderTextColor="#9ca3af"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Material Type
                </Text>
                <TextInput
                  value={materialType}
                  onChangeText={setMaterialType}
                  placeholder="e.g., Concrete, Asphalt"
                  placeholderTextColor="#9ca3af"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Price
                </Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="$0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Notes
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Additional notes..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground min-h-[100px]"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-primary rounded-lg py-4 items-center mb-6"
          >
            <Text className="text-base font-semibold text-primary-foreground">
              Create Job
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Customer Search Modal */}
      <Modal
        visible={showCustomerSearch}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCustomerSearch(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl h-3/4">
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-foreground">
                  Select Customer
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCustomerSearch(false)}
                  className="w-8 h-8 bg-muted rounded-full items-center justify-center"
                >
                  <Text className="text-foreground">✕</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center bg-card border border-border rounded-lg px-4 py-3">
                <Text className="text-xl mr-2">🔍</Text>
                <TextInput
                  value={customerSearch}
                  onChangeText={setCustomerSearch}
                  placeholder="Search customers..."
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-base text-foreground"
                  autoFocus
                />
              </View>
            </View>

            <ScrollView className="flex-1 p-4">
              {filteredCustomers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  onPress={() => handleSelectCustomer(customer)}
                  className="bg-card border border-border rounded-lg p-4 mb-3"
                >
                  <Text className="text-base font-semibold text-foreground">
                    {customer.name}
                  </Text>
                  {customer.company && (
                    <Text className="text-sm text-muted-foreground mt-1">
                      {customer.company}
                    </Text>
                  )}
                  <Text className="text-sm text-muted-foreground mt-1">
                    {customer.email}
                  </Text>
                </TouchableOpacity>
              ))}

              {filteredCustomers.length === 0 && (
                <View className="items-center justify-center py-20">
                  <Text className="text-4xl mb-4">🔍</Text>
                  <Text className="text-lg font-semibold text-foreground">
                    No customers found
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-2">
                    Try a different search term
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
