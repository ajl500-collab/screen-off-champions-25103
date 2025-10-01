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
    <div>
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
          
    </div>
  );
};

export default Leaderboard;
