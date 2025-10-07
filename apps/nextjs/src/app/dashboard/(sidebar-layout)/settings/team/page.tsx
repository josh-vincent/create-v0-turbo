import { Separator } from "@tocld/ui/separator";
import { Button } from "@tocld/ui/button";
import { Card } from "@tocld/ui/card";
import { Input } from "@tocld/ui/input";
import { Label } from "@tocld/ui/label";
import { Badge } from "@tocld/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@tocld/ui/avatar";
import { UserPlus, Mail, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tocld/ui/dropdown-menu";

// Mock team data
const teamMembers = [
  {
    id: "1",
    name: "You",
    email: "user@example.com",
    role: "Owner",
    avatar: null,
  },
];

export default function TeamSettingsPage() {
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
        <Button disabled>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Separator />

      {/* Invite Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Invite Team Members</h2>
            <p className="text-sm text-muted-foreground">
              Send invitations to join your team
            </p>
          </div>

          <Separator />

          <div className="flex gap-2">
            <div className="flex-1 grid gap-2">
              <Label htmlFor="email-invite">Email Address</Label>
              <Input
                id="email-invite"
                type="email"
                placeholder="colleague@example.com"
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value="Member"
                disabled
                className="w-32"
              />
            </div>
            <div className="grid gap-2">
              <Label>&nbsp;</Label>
              <Button disabled>
                <Mail className="mr-2 h-4 w-4" />
                Send Invite
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Team invitations will be sent via email
          </p>
        </div>
      </Card>

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
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>Change Role</DropdownMenuItem>
                    <DropdownMenuItem disabled className="text-destructive">
                      Remove Member
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
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
