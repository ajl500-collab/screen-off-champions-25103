import { useState } from "react";
import { Trophy, Users, Plus, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Leaderboard from "@/components/Leaderboard";
import Header from "@/components/Header";

const mockCommunities = [
  {
    id: 1,
    name: "Squad Alpha",
    members: 12,
    teamType: "Trios",
    weekEnds: "3d 14h",
    yourRank: 2,
    yourTeam: "Team Phoenix"
  },
  {
    id: 2,
    name: "College Bros",
    members: 24,
    teamType: "Squads",
    weekEnds: "3d 14h",
    yourRank: 7,
    yourTeam: "The Grinders"
  }
];

const Communities = () => {
  const [activeTab, setActiveTab] = useState<"my" | "join">("my");
  const [activeCommunity, setActiveCommunity] = useState(0);
  const [inviteCode, setInviteCode] = useState("");

  const currentCommunity = mockCommunities[activeCommunity];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Communities</h1>
        
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
          {/* Community Carousel */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {mockCommunities.map((comm, idx) => (
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

          {/* Community Info Card */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{currentCommunity.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentCommunity.members} members • {currentCommunity.teamType}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Week ends in</div>
                <div className="text-lg font-bold text-primary">{currentCommunity.weekEnds}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-card/50 rounded-lg p-3 border border-border/50">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Your Team</div>
                <div className="font-semibold">{currentCommunity.yourTeam}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Your Rank</div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="font-bold text-primary">#{currentCommunity.yourRank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Live Leaderboard
              </h3>
            </div>
            <Leaderboard />
          </div>
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
  );
};

export default Communities;
