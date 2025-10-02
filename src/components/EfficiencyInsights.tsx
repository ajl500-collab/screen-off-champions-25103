import { TrendingUp, TrendingDown, Brain, Zap } from "lucide-react";

const appBreakdown = [
  { category: "Productive", apps: ["LinkedIn", "WSJ", "Notion"], time: "2h 15m", multiplier: "+1.5x", color: "success" },
  { category: "Unproductive", apps: ["Instagram", "TikTok", "YouTube"], time: "1h 45m", multiplier: "-1.5x", color: "destructive" },
  { category: "Utility", apps: ["Messages", "Clock", "Maps"], time: "0h 35m", multiplier: "0x", color: "muted" },
];

const EfficiencyInsights = () => {
  return (
    <section className="py-24 relative bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <Brain className="inline w-4 h-4 mr-2" />
              How Rankings Work
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Efficiency Algorithm</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            It's not just about total screen time—it's about <strong>how</strong> you use your phone. 
            Productive apps boost your score. Unproductive apps tank it.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Algorithm explanation */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              How Your Score is Calculated
            </h3>
            
            <div className="space-y-4 text-muted-foreground">
              <p>
                Every app you use is categorized based on productivity:
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-success/5 border border-success/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h4 className="font-bold text-success">Productive</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Apps that add value: LinkedIn, WSJ, Notion, Kindle, educational platforms</p>
                </div>
                
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-destructive" />
                    <h4 className="font-bold text-destructive">Unproductive</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Time-wasting apps: TikTok, Instagram, games, endless scrolling</p>
                </div>
                
                <div className="bg-muted/30 border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded bg-muted" />
                    <h4 className="font-bold">Utility</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Essential tools: Messages, Clock, Maps, Phone, Settings</p>
                </div>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm">
                  Your efficiency is calculated using a weighted algorithm. Productive apps boost your score significantly, unproductive apps drag it down, and utility apps remain neutral.
                </p>
              </div>
            </div>
          </div>

          {/* Example breakdown */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">Example: Daily Breakdown</h3>
            
            <div className="space-y-4">
              {appBreakdown.map((item, index) => (
                <div 
                  key={index}
                  className={`border rounded-xl p-4 ${
                    item.color === 'success' ? 'bg-success/5 border-success/20' :
                    item.color === 'destructive' ? 'bg-destructive/5 border-destructive/20' :
                    'bg-muted/20 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className={`font-bold text-lg ${
                          item.color === 'success' ? 'text-success' :
                          item.color === 'destructive' ? 'text-destructive' :
                          'text-muted-foreground'
                        }`}>
                          {item.category}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.color === 'success' ? 'bg-success text-primary-foreground' :
                          item.color === 'destructive' ? 'bg-destructive text-primary-foreground' :
                          'bg-muted text-foreground'
                        }`}>
                          {item.multiplier}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.apps.join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono">{item.time}</div>
                      <div className="text-sm text-muted-foreground">screen time</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Final Efficiency Score</div>
                  <div className="text-3xl font-bold text-success">+45</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Leaderboard Rank</div>
                  <div className="text-3xl font-bold text-primary">#2</div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Master the algorithm. Use your phone smarter, not less.
            </p>
          <button 
            onClick={() => window.location.href = "/auth"}
            className="text-primary font-semibold hover:underline text-lg"
          >
            Start tracking your efficiency →
          </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EfficiencyInsights;
