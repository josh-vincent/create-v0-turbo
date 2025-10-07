import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@tocld/supabase/server";
import { User } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const email = user?.email || "user@example.com";
  const initials = email
    .split("@")[0]
    .split(".")
    .map((n) => n[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      {/* Profile Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Profile</h2>
            <p className="text-sm text-muted-foreground">
              Update your personal information
            </p>
          </div>

          <Separator />

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">Profile Picture</p>
              <p className="text-sm text-muted-foreground">
                Upload a new profile picture
              </p>
              <Button variant="outline" size="sm" disabled>
                <User className="mr-2 h-4 w-4" />
                Change Avatar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Email */}
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="max-w-md"
            />
            <p className="text-sm text-muted-foreground">
              Your email address is managed by your authentication provider
            </p>
          </div>

          {/* Name */}
          <div className="grid gap-3">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="max-w-md"
              disabled
            />
            <p className="text-sm text-muted-foreground">
              This is your display name
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-2">
            <Button disabled>Save Changes</Button>
            <Button variant="outline" disabled>Cancel</Button>
          </div>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Preferences</h2>
            <p className="text-sm text-muted-foreground">
              Customize your experience
            </p>
          </div>

          <Separator />

          <div className="grid gap-3">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value="America/New_York (UTC-05:00)"
              disabled
              className="max-w-md"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value="English"
              disabled
              className="max-w-md"
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/50">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-destructive mb-1">
              Danger Zone
            </h2>
            <p className="text-sm text-muted-foreground">
              Irreversible actions for your account
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
