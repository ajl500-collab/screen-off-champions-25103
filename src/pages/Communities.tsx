import { useState, useEffect } from "react";
import { Trophy, Users, Plus, Code, MessageCircle, Circle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Leaderboard from "@/components/Leaderboard";
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OnlineUser {
  user_id: string;
  display_name: string;
  avatar_emoji: string;
  online_at: string;
}

interface Community {
  id: string;
  name: string;
  invite_code: string;
  team_type: string;
  created_by: string;
  member_count?: number;
}

const Communities = () => {
  const [activeTab, setActiveTab] = useState<"my" | "join">("my");
  const [activeCommunityIndex, setActiveCommunityIndex] = useState(0);
  const [inviteCode, setInviteCode] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityType, setNewCommunityType] = useState("solos");
  const [copiedCode, setCopiedCode] = useState(false);
  const { toast } = useToast();

  const currentCommunity = myCommunities[activeCommunityIndex];

  useEffect(() => {
    initializePresence();
    loadMyCommunities();
    return () => {
      supabase.channel('community-presence').unsubscribe();
    };
  }, []);

  const loadMyCommunities = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get communities user is a member of
    const { data: memberData } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', user.id);

    if (!memberData || memberData.length === 0) {
      setMyCommunities([]);
      return;
    }

    const communityIds = memberData.map(m => m.community_id);

    // Get full community details
    const { data: communities } = await supabase
      .from('communities')
      .select('*')
      .in('id', communityIds);

    if (communities) {
      // Get member counts
      const communitiesWithCounts = await Promise.all(
        communities.map(async (comm) => {
          const { count } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', comm.id);
          return { ...comm, member_count: count || 0 };
        })
      );
      setMyCommunities(communitiesWithCounts);
    }
  };

  const handleCreateCommunity = async () => {
    if (!newCommunityName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a community name",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Generate invite code
    const { data: codeData } = await supabase.rpc('generate_invite_code');
    const inviteCode = codeData || Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create community
    const { data: community, error } = await supabase
      .from('communities')
      .insert({
        name: newCommunityName,
        invite_code: inviteCode,
        team_type: newCommunityType,
        created_by: user.id
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create community",
        variant: "destructive"
      });
      return;
    }

    // Add creator as member
    await supabase
      .from('community_members')
      .insert({
        community_id: community.id,
        user_id: user.id
      });

    toast({
      title: "Success!",
      description: `Created "${newCommunityName}" with code: ${inviteCode}`
    });

    setNewCommunityName("");
    setNewCommunityType("solos");
    loadMyCommunities();
    setActiveTab("my");
  };

  const handleJoinCommunity = async () => {
    if (!inviteCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invite code",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Find community by invite code
    const { data: community, error: findError } = await supabase
      .from('communities')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (findError || !community) {
      toast({
        title: "Error",
        description: "Invalid invite code",
        variant: "destructive"
      });
      return;
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('community_members')
      .select('*')
      .eq('community_id', community.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      toast({
        title: "Already Joined",
        description: "You're already a member of this community"
      });
      return;
    }

    // Join community
    const { error: joinError } = await supabase
      .from('community_members')
      .insert({
        community_id: community.id,
        user_id: user.id
      });

    if (joinError) {
      toast({
        title: "Error",
        description: "Failed to join community",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: `Joined "${community.name}"`
    });

    setInviteCode("");
    loadMyCommunities();
    setActiveTab("my");
  };

  const copyInviteCode = () => {
    if (currentCommunity) {
      navigator.clipboard.writeText(currentCommunity.invite_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard"
      });
    }
  };

  const initializePresence = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserId(user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_emoji')
      .eq('id', user.id)
      .maybeSingle();

    const channel = supabase.channel('community-presence');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<OnlineUser>();
        const users: OnlineUser[] = [];
        
        Object.keys(state).forEach(key => {
          const presences = state[key] as OnlineUser[];
          if (presences && presences.length > 0) {
            users.push(presences[0]);
          }
        });
        
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            display_name: profile?.display_name || 'User',
            avatar_emoji: profile?.avatar_emoji || '😊',
            online_at: new Date().toISOString(),
          });
        }
      });
  };

  return (
    <>
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
      
      <div className="min-h-screen bg-background pb-24 pt-24">
        <Header />
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Communities</h1>
            <Button onClick={() => setShowChat(true)} className="gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat
            </Button>
          </div>
          
          {/* Toggle Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "my" ? "default" : "outline"}
              onClick={() => setActiveTab("my")}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              My Communities
            </Button>
            <Button
              variant={activeTab === "join" ? "default" : "outline"}
              onClick={() => setActiveTab("join")}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Join/Create
            </Button>
          </div>
        </div>

        {activeTab === "my" ? (
          <div className="px-4 py-6">
            {myCommunities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't joined any communities yet</p>
                <Button onClick={() => setActiveTab("join")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Join or Create One
                </Button>
              </div>
            ) : (
              <>
                {/* Community Carousel */}
                <div className="mb-6">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {myCommunities.map((comm, idx) => (
                      <button
                        key={comm.id}
                        onClick={() => setActiveCommunityIndex(idx)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                          activeCommunityIndex === idx
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {comm.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
                  <div className="p-4 border-b border-border bg-muted/30">
                    <h3 className="font-bold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Live Leaderboard
                    </h3>
                  </div>
                  <Leaderboard />
                </div>

                {/* Online Members Card */}
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Circle className="w-4 h-4 text-success fill-success animate-pulse" />
                      Online Now ({onlineUsers.length})
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Get them off their phones! 📱
                    </span>
                  </div>
                  
                  {onlineUsers.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      No one is online right now
                    </div>
                  ) : (
                    <ScrollArea className="max-h-48">
                      <div className="space-y-2">
                        {onlineUsers.map((user) => (
                          <div
                            key={user.user_id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                              user.user_id === currentUserId
                                ? 'bg-primary/10 border border-primary/20'
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback className="text-lg">
                                    {user.avatar_emoji}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card animate-pulse" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm">
                                  {user.display_name}
                                  {user.user_id === currentUserId && (
                                    <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                                  )}
                                </div>
                                <div className="text-xs text-success flex items-center gap-1">
                                  <Circle className="w-2 h-2 fill-success" />
                                  Online
                                </div>
                              </div>
                            </div>
                            {user.user_id !== currentUserId && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => {
                                  toast({
                                    title: "Reminder Sent! 📱",
                                    description: `Told ${user.display_name} to get off their phone!`,
                                  });
                                }}
                              >
                                Remind 🔔
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Community Info Card */}
                {currentCommunity && (
                  <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{currentCommunity.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {currentCommunity.member_count} members • {currentCommunity.team_type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Invite Code</div>
                          <div className="font-mono font-bold text-lg">{currentCommunity.invite_code}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyInviteCode}
                          className="gap-2"
                        >
                          {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedCode ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Share this code with friends to invite them
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="px-4 py-6 space-y-6">
            {/* Join Community */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Join with Code
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Enter an invite code to join an existing community
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="flex-1 font-mono"
                  maxLength={6}
                />
                <Button onClick={handleJoinCommunity}>Join</Button>
              </div>
            </div>

            {/* Create Community */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Create New Community
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your own competition and invite friends
              </p>
              <div className="space-y-3">
                <Input 
                  placeholder="Community name" 
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                />
                <Select value={newCommunityType} onValueChange={setNewCommunityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solos">Solos (1v1v1)</SelectItem>
                    <SelectItem value="duos">Duos (2v2v2)</SelectItem>
                    <SelectItem value="trios">Trios (3v3v3)</SelectItem>
                    <SelectItem value="squads">Squads (4v4v4)</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full" onClick={handleCreateCommunity}>Create Community</Button>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h4 className="font-bold mb-3">How Challenges Work</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Every Sunday, teams are randomly formed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Track automatically via Apple Shortcuts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Winners get glory, losers get roasted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Efficiency matters more than raw time</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Communities;