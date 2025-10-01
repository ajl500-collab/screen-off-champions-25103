import { Trophy, TrendingDown, TrendingUp } from "lucide-react";

const mockLeaderboard = [
  { rank: 1, name: "Alex", team: "Squad Alpha", screenTime: "2h 14m", change: -47, avatar: "🏆", efficiencyScore: 87 },
  { rank: 2, name: "Jordan", team: "Duo Dynamic", screenTime: "3h 08m", change: -35, avatar: "🥈", efficiencyScore: 64 },
  { rank: 3, name: "Sam", team: "Squad Alpha", screenTime: "3h 42m", change: -28, avatar: "🥉", efficiencyScore: 52 },
  { rank: 4, name: "Casey", team: "Solo Warrior", screenTime: "4h 17m", change: -19, avatar: "😎", efficiencyScore: 38 },
  { rank: 5, name: "Taylor", team: "Duo Dynamic", screenTime: "5h 33m", change: -8, avatar: "😅", efficiencyScore: -15 },
  { rank: 6, name: "Morgan", team: "Squad Beta", screenTime: "6h 52m", change: 12, avatar: "🤡", efficiencyScore: -42 },
];

const Leaderboard = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Live <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Leaderboard</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See who's crushing it and who's getting crushed. Updated in real-time, stakes are high.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Weekly challenge header */}
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">Week 23 Challenge</h3>
                <p className="text-muted-foreground">Squad Showdown • Ends in 3d 14h</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">83</div>
                <div className="text-sm text-muted-foreground">Teams Competing</div>
              </div>
            </div>
          </div>
          
          {/* Leaderboard table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">Player</th>
                    <th className="text-left p-4 font-semibold">Team</th>
                    <th className="text-right p-4 font-semibold">Efficiency</th>
                    <th className="text-right p-4 font-semibold">Screen Time</th>
                    <th className="text-right p-4 font-semibold">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((player) => (
                    <tr 
                      key={player.rank}
                      className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${
                        player.rank <= 3 ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            player.rank === 1 ? 'text-success' :
                            player.rank === 2 ? 'text-primary' :
                            player.rank === 3 ? 'text-accent' :
                            'text-muted-foreground'
                          }`}>
                            #{player.rank}
                          </span>
                          {player.rank <= 3 && <Trophy className="w-4 h-4 text-primary" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{player.avatar}</span>
                          <span className="font-semibold">{player.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{player.team}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className={`px-3 py-1 rounded-lg font-bold ${
                            player.efficiencyScore > 50 
                              ? 'bg-success/10 text-success' 
                              : player.efficiencyScore > 0
                              ? 'bg-primary/10 text-primary'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            {player.efficiencyScore > 0 ? '+' : ''}{player.efficiencyScore}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-semibold">{player.screenTime}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                          player.change < 0 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {player.change < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          <span className="font-semibold">{Math.abs(player.change)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success">-34%</div>
              <div className="text-sm text-muted-foreground">Avg Reduction</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">4h 12m</div>
              <div className="text-sm text-muted-foreground">Avg Screen Time</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent">247</div>
              <div className="text-sm text-muted-foreground">Players Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
