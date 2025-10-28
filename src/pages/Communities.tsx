import { useState, useEffect } from "react";
import { Trophy, Users, Plus, Code, MessageCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaderboard } from "@/features/leaderboard/Leaderboard";
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
  team_type: string;
  members: number;
  weekEnds: string;
}

const Communities = () => {
  const [activeTab, setActiveTab] = useState<"my" | "join">("my");
  const [activeCommunity, setActiveCommunity] = useState(0);
  const [inviteCode, setInviteCode] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const currentCommunity = communities[activeCommunity];

  useEffect(() => {
    fetchCommunities();
    initializePresence();
    return () => {
      // Cleanup presence when component unmounts
      supabase.channel('community-presence').unsubscribe();
    };
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get communities the user is a member of
      const { data: memberships, error: memberError } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (!memberships || memberships.length === 0) {
        setCommunities([]);
        setLoading(false);
        return;
      }

      const communityIds = memberships.map(m => m.community_id);

      // Fetch community details
      const { data: communitiesData, error: commError } = await supabase
        .from('communities')
        .select('*')
        .in('id', communityIds);

      if (commError) throw commError;

      // Count members for each community
      const communitiesWithCounts = await Promise.all(
        (communitiesData || []).map(async (comm) => {
          const { count } = await supabase
            .from('community_members')
            .select('*', { count: 'exact', head: true })
            .eq('community_id', comm.id);

          return {
            id: comm.id,
            name: comm.name,
            team_type: comm.team_type,
            members: count || 0,
            weekEnds: "3d 14h" // This could be calculated from created_at
          };
        })
      );

      setCommunities(communitiesWithCounts);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializePresence = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserId(user.id);

    // Get user profile info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('display_name, avatar_emoji')
      .eq('id', user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return;
    }

    const channel = supabase.channel('community-presence');

    // Track presence state
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
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : communities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">You're not part of any communities yet</p>
                <Button onClick={() => setActiveTab("join")}>Join or Create a Community</Button>
              </div>
            ) : (
              <>
                {/* Community Carousel */}
                <div className="mb-6">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {communities.map((comm, idx) => (
                  <button
                    key={comm.id}
                    onClick={() => setActiveCommunity(idx)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                      activeCommunity === idx
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
                <div className="mb-6">
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
                          {currentCommunity.members} members • {currentCommunity.team_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Week ends in</div>
                        <div className="text-lg font-bold text-primary">{currentCommunity.weekEnds}</div>
                      </div>
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
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="flex-1"
                />
                <Button>Join</Button>
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
                <Input placeholder="Community name" />
                <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                  <option>Solos (1v1v1)</option>
                  <option>Duos (2v2v2)</option>
                  <option>Trios (3v3v3)</option>
                  <option>Squads (4v4v4)</option>
                </select>
                <Button className="w-full">Create Community</Button>
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
