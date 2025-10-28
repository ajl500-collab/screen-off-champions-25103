import { useRoastHistory, useMotivationHistory, useWeeklySummaryHistory } from "@/lib/ai/queries";
import { AIMessageCard } from "./AIMessageCard";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";

export const AIMessageHistory = () => {
  const { data: roasts, isLoading: roastsLoading } = useRoastHistory(10);
  const { data: motivations, isLoading: motivationsLoading } = useMotivationHistory(10);
  const { data: summaries, isLoading: summariesLoading } = useWeeklySummaryHistory(4);

  if (roastsLoading || motivationsLoading || summariesLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">AI Message History</h2>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="roasts">Roasts ({roasts?.length || 0})</TabsTrigger>
          <TabsTrigger value="motivation">Motivation ({motivations?.length || 0})</TabsTrigger>
          <TabsTrigger value="summaries">Summaries ({summaries?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {/* Combine and sort all messages by date */}
          {[
            ...(roasts?.map(r => ({ ...r, type: 'roast' as const })) || []),
            ...(motivations?.map(m => ({ ...m, type: 'motivation' as const })) || [])
          ]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map((message) => (
              <AIMessageCard
                key={message.id}
                content={message.content}
                type={message.type}
                createdAt={message.created_at}
                triggerReason={message.trigger_reason}
              />
            ))}
          {!roasts?.length && !motivations?.length && (
            <p className="text-center text-muted-foreground py-8">
              No messages yet. Keep tracking your screen time!
            </p>
          )}
        </TabsContent>

        <TabsContent value="roasts" className="space-y-3 mt-4">
          {roasts?.map((roast) => (
            <AIMessageCard
              key={roast.id}
              content={roast.content}
              type="roast"
              createdAt={roast.created_at}
              triggerReason={roast.trigger_reason}
            />
          ))}
          {!roasts?.length && (
            <p className="text-center text-muted-foreground py-8">
              No roasts yet. That's... good? 🤔
            </p>
          )}
        </TabsContent>

        <TabsContent value="motivation" className="space-y-3 mt-4">
          {motivations?.map((motivation) => (
            <AIMessageCard
              key={motivation.id}
              content={motivation.content}
              type="motivation"
              createdAt={motivation.created_at}
              triggerReason={motivation.trigger_reason}
            />
          ))}
          {!motivations?.length && (
            <p className="text-center text-muted-foreground py-8">
              No motivations yet. Time to improve! 💪
            </p>
          )}
        </TabsContent>

        <TabsContent value="summaries" className="space-y-3 mt-4">
          {summaries?.map((summary) => (
            <Card key={summary.id} className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(summary.week_start), "MMM d")} - {format(new Date(summary.week_end), "MMM d, yyyy")}
                  </div>
                  <p className="text-sm text-foreground">{summary.summary}</p>
                  {summary.efficiency_change !== null && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Efficiency: {summary.efficiency_change > 0 ? '+' : ''}{summary.efficiency_change}%
                      </span>
                      {summary.top_productive_app && (
                        <span>✅ {summary.top_productive_app}</span>
                      )}
                      {summary.top_unproductive_app && (
                        <span>⚠️ {summary.top_unproductive_app}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {!summaries?.length && (
            <p className="text-center text-muted-foreground py-8">
              No weekly summaries yet. Check back next week! 📅
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
