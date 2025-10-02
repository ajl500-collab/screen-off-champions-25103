import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, Bell, Shield, Palette, LogOut } from "lucide-react";
import Header from "@/components/Header";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    username: "",
    avatar_emoji: "😎",
  });
  const [notifications, setNotifications] = useState({
    push_enabled: true,
    daily_summary: true,
    rank_updates: true,
    challenge_reminders: true,
  });
  const [privacy, setPrivacy] = useState({
    profile_visible: true,
    show_screen_time: true,
    show_efficiency: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          display_name: data.display_name || "",
          username: data.username || "",
          avatar_emoji: data.avatar_emoji || "😎",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          display_name: profile.display_name,
          username: profile.username,
          avatar_emoji: profile.avatar_emoji,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      <Header />
      
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Settings */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Profile Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <Label htmlFor="emoji">Avatar Emoji</Label>
              <Input
                id="emoji"
                value={profile.avatar_emoji}
                onChange={(e) => setProfile({ ...profile, avatar_emoji: e.target.value })}
                placeholder="Pick an emoji"
                maxLength={2}
              />
            </div>

            <Button onClick={saveProfile} disabled={isLoading} className="w-full">
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Push Notifications</div>
                <div className="text-xs text-muted-foreground">Receive push notifications</div>
              </div>
              <Switch
                checked={notifications.push_enabled}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, push_enabled: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Daily Summary</div>
                <div className="text-xs text-muted-foreground">Daily screen time report</div>
              </div>
              <Switch
                checked={notifications.daily_summary}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, daily_summary: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Rank Updates</div>
                <div className="text-xs text-muted-foreground">When your rank changes</div>
              </div>
              <Switch
                checked={notifications.rank_updates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, rank_updates: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Challenge Reminders</div>
                <div className="text-xs text-muted-foreground">Weekly challenge notifications</div>
              </div>
              <Switch
                checked={notifications.challenge_reminders}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, challenge_reminders: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Public Profile</div>
                <div className="text-xs text-muted-foreground">Others can view your profile</div>
              </div>
              <Switch
                checked={privacy.profile_visible}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, profile_visible: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Show Screen Time</div>
                <div className="text-xs text-muted-foreground">Display your screen time data</div>
              </div>
              <Switch
                checked={privacy.show_screen_time}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, show_screen_time: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Show Efficiency Score</div>
                <div className="text-xs text-muted-foreground">Display your efficiency rating</div>
              </div>
              <Switch
                checked={privacy.show_efficiency}
                onCheckedChange={(checked) =>
                  setPrivacy({ ...privacy, show_efficiency: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Dark Mode</div>
                <div className="text-xs text-muted-foreground">Currently enabled by default</div>
              </div>
              <Switch checked={true} disabled />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <LogOut className="w-5 h-5 text-destructive" />
            <h2 className="text-lg font-bold">Account</h2>
          </div>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
