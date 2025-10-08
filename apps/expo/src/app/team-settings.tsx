import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "worker";
  status: "active" | "inactive";
  avatar?: string;
}

export default function TeamSettingsScreen() {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<TeamMember["role"]>("worker");

  // Mock team members - replace with actual tRPC query
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john@company.com",
      role: "admin",
      status: "active",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "manager",
      status: "active",
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@company.com",
      role: "worker",
      status: "active",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@company.com",
      role: "worker",
      status: "active",
    },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "manager":
        return "bg-blue-500";
      case "worker":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      Alert.alert("Error", "Please enter name and email");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      status: "active",
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("worker");
    setShowAddMember(false);
    Alert.alert("Success", "Team member added successfully");
  };

  const handleRemoveMember = (id: string) => {
    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this team member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setTeamMembers(teamMembers.filter((m) => m.id !== id));
          },
        },
      ]
    );
  };

  const handleToggleStatus = (id: string) => {
    setTeamMembers(
      teamMembers.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    );
  };

  const activeMembers = teamMembers.filter((m) => m.status === "active").length;
  const membersByRole = {
    admin: teamMembers.filter((m) => m.role === "admin").length,
    manager: teamMembers.filter((m) => m.role === "manager").length,
    worker: teamMembers.filter((m) => m.role === "worker").length,
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <Stack.Screen options={{ title: "Team Settings", headerShadowVisible: false }} />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Team Overview */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Team Overview
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-2xl font-bold text-foreground">
                {teamMembers.length}
              </Text>
              <Text className="text-xs text-muted-foreground">Total Members</Text>
            </View>
            <View className="flex-1 bg-card border border-border rounded-lg p-4">
              <Text className="text-2xl font-bold text-green-600">
                {activeMembers}
              </Text>
              <Text className="text-xs text-muted-foreground">Active</Text>
            </View>
          </View>
        </View>

        {/* Members by Role */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Members by Role
          </Text>
          <View className="bg-card border border-border rounded-lg p-4 space-y-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-red-500" />
                <Text className="text-sm text-foreground">Administrators</Text>
              </View>
              <Text className="text-base font-semibold text-foreground">
                {membersByRole.admin}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-blue-500" />
                <Text className="text-sm text-foreground">Managers</Text>
              </View>
              <Text className="text-base font-semibold text-foreground">
                {membersByRole.manager}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-green-500" />
                <Text className="text-sm text-foreground">Workers</Text>
              </View>
              <Text className="text-base font-semibold text-foreground">
                {membersByRole.worker}
              </Text>
            </View>
          </View>
        </View>

        {/* Team Members List */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-foreground">
              Team Members
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddMember(true)}
              className="bg-primary rounded-md px-3 py-1.5"
            >
              <Text className="text-xs font-medium text-primary-foreground">
                Add Member
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {teamMembers.map((member) => (
              <View
                key={member.id}
                className="bg-card border border-border rounded-lg p-4"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-base font-semibold text-foreground">
                        {member.name}
                      </Text>
                      <View className={`${getRoleColor(member.role)} px-2 py-0.5 rounded`}>
                        <Text className="text-xs font-medium text-white capitalize">
                          {member.role}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-muted-foreground">
                      {member.email}
                    </Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded ${
                      member.status === "active"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        member.status === "active"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {member.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleToggleStatus(member.id)}
                    className="flex-1 bg-muted rounded-md py-2 items-center"
                  >
                    <Text className="text-xs font-medium text-foreground">
                      {member.status === "active" ? "Deactivate" : "Activate"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member.id)}
                    className="flex-1 bg-red-500 rounded-md py-2 items-center"
                  >
                    <Text className="text-xs font-medium text-white">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Team Settings */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Team Settings
          </Text>
          <View className="space-y-2">
            <TouchableOpacity className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-foreground">
                  Team Name
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Update your team name
                </Text>
              </View>
              <Text className="text-xl text-muted-foreground">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-foreground">
                  Permissions
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Configure role permissions
                </Text>
              </View>
              <Text className="text-xl text-muted-foreground">→</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-card border border-border rounded-lg p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-foreground">
                  Invitations
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  Manage pending invitations
                </Text>
              </View>
              <Text className="text-xl text-muted-foreground">→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMember}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddMember(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-foreground">
                Add Team Member
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddMember(false)}
                className="w-8 h-8 bg-muted rounded-full items-center justify-center"
              >
                <Text className="text-foreground">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Name *
                </Text>
                <TextInput
                  value={newMemberName}
                  onChangeText={setNewMemberName}
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Email *
                </Text>
                <TextInput
                  value={newMemberEmail}
                  onChangeText={setNewMemberEmail}
                  placeholder="john@company.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-card border border-border rounded-lg px-4 py-3 text-base text-foreground"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  Role
                </Text>
                <View className="flex-row gap-2">
                  {(["admin", "manager", "worker"] as const).map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => setNewMemberRole(role)}
                      className={`flex-1 py-2 rounded-lg ${
                        newMemberRole === role
                          ? getRoleColor(role)
                          : "bg-muted"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium text-center capitalize ${
                          newMemberRole === role
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row gap-2 mt-4">
                <TouchableOpacity
                  onPress={handleAddMember}
                  className="flex-1 bg-primary rounded-lg py-3 items-center"
                >
                  <Text className="text-base font-semibold text-primary-foreground">
                    Add Member
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNewMemberName("");
                    setNewMemberEmail("");
                    setNewMemberRole("worker");
                    setShowAddMember(false);
                  }}
                  className="flex-1 bg-muted rounded-lg py-3 items-center"
                >
                  <Text className="text-base font-semibold text-foreground">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
