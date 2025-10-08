"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { Separator } from "@tocld/ui/separator";
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Input } from "@tocld/ui/input";
import { Label } from "@tocld/ui/label";
import { Badge } from "@tocld/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@tocld/ui/avatar";
import { UserPlus, Mail, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@tocld/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tocld/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tocld/ui/select";
import { toast } from "sonner";

export default function TeamSettingsPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"owner" | "admin" | "member">("member");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Queries
  const { data: teams, isLoading: teamsLoading } = useQuery(
    trpc.team.list.queryOptions()
  );
  const currentTeam = teams?.[0]; // Default to first team

  const { data: teamDetails } = useQuery(
    trpc.team.get.queryOptions(
      { id: currentTeam?.id ?? "" },
      { enabled: !!currentTeam?.id }
    )
  );

  // Mutations
  const removeMemberMutation = useMutation(
    trpc.team.removeMember.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.team.pathFilter());
        toast.success("Team member removed");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove member");
      },
    })
  );

  const updateRoleMutation = useMutation(
    trpc.team.updateMemberRole.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.team.pathFilter());
        toast.success("Member role updated");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update role");
      },
    })
  );

  const handleRemoveMember = (memberId: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      removeMemberMutation.mutate({ memberId });
    }
  };

  const handleChangeRole = (memberId: string, newRole: "owner" | "admin" | "member") => {
    updateRoleMutation.mutate({ memberId, role: newRole });
  };

  if (teamsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const teamMembers = teamDetails?.members ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and invitations
          </p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" disabled>
                <Mail className="mr-2 h-4 w-4" />
                Send Invite (Coming Soon)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Team Members */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">Team Members</h2>
              <p className="text-sm text-muted-foreground">
                {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No team members yet
              </div>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.profile?.avatarUrl ?? undefined} />
                      <AvatarFallback>
                        {(member.profile?.fullName || member.profile?.email || "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {member.profile?.fullName || member.profile?.email}
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.profile?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleChangeRole(member.id, "member")}
                      >
                        Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleChangeRole(member.id, "admin")}
                      >
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleChangeRole(member.id, "owner")}
                      >
                        Owner
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Pending Invitations */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Pending Invitations</h2>
            <p className="text-sm text-muted-foreground">
              Invitations awaiting acceptance
            </p>
          </div>

          <Separator />

          <div className="text-center py-8 text-sm text-muted-foreground">
            No pending invitations
          </div>
        </div>
      </Card>

      {/* Roles & Permissions */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Roles & Permissions</h2>
            <p className="text-sm text-muted-foreground">
              Understand different team roles
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge>Owner</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                Full access to all settings, can manage team members and billing
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Admin</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                Can manage team members and project settings
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Member</Badge>
              <p className="text-sm text-muted-foreground flex-1">
                Can view and edit projects, limited settings access
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
