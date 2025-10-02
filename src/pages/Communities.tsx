import { Trophy, Users, TrendingUp, Settings, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Communities = () => {
  const navigate = useNavigate();
  
  // Mock data for teams/communities
  const currentWeekTheme = "Space Explorers";
  const teamMode = "Trios"; // Can be "Solos", "Duos", or "Trios"
  
  const communities = [
    { name: "Cosmic Navigators", members: 3, avgEfficiency: 78, rank: 2, emoji: "🚀", teamSize: 3 },
    { name: "Stellar Voyagers", members: 3, avgEfficiency: 82, rank: 1, emoji: "⭐", teamSize: 3 },
    { name: "Galaxy Wanderers", members: 2, avgEfficiency: 65, rank: 5, emoji: "🌌", teamSize: 2 },
    { name: "Nebula Seekers", members: 3, avgEfficiency: 71, rank: 3, emoji: "☄️", teamSize: 3 },
    { name: "Astro Pioneers", members: 3, avgEfficiency: 85, rank: 1, emoji: "🛸", teamSize: 3 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Communities</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-muted-foreground">Join forces and compete together</p>
      </div>

      {/* Weekly Theme & Mode */}
      <div className="px-4 py-4 space-y-3">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-4">
          <div className="text-sm text-muted-foreground mb-1">This Week's Theme</div>
          <div className="text-2xl font-bold">{currentWeekTheme}</div>
          <div className="text-sm text-primary mt-2">Competition Mode: {teamMode}</div>
        </div>

        <Button 
          onClick={() => navigate('/chat')}
          className="w-full bg-accent hover:bg-accent/90"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Open Chat
        </Button>
      </div>

      {/* Teams/Squads */}
      <div className="px-4 pb-6">
        <h2 className="text-xl font-bold mb-4">Teams This Week</h2>
        
        <div className="space-y-3">
          {communities.map((community, idx) => (
            <div 
              key={idx}
              className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{community.emoji}</span>
                  <div>
                    <h3 className="font-semibold">{community.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {community.members} {community.teamSize === 1 ? 'player' : 'players'} • {community.teamSize === 1 ? 'Solo' : community.teamSize === 2 ? 'Duo' : 'Trio'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">#{community.rank}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground">Avg Efficiency</span>
                </div>
                <span className="text-lg font-bold text-success">{community.avgEfficiency}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
