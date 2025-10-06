import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DailyHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface DailyData {
  date: string;
  totalMinutes: number;
  efficiencyScore: number;
  efficientMinutes: number;
  inefficientMinutes: number;
}

export const DailyHistoryModal = ({ isOpen, onClose, userId }: DailyHistoryModalProps) => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [history, setHistory] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchHistory = async () => {
      setLoading(true);
      const daysBack = period === "week" ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const { data, error } = await supabase
        .from('user_screen_time')
        .select('*, app_categories(category, efficiency_multiplier)')
        .eq('user_id', userId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (!error && data) {
        // Group by date
        const grouped = data.reduce((acc: Record<string, DailyData>, entry: any) => {
          const date = entry.date;
          if (!acc[date]) {
            acc[date] = {
              date,
              totalMinutes: 0,
              efficiencyScore: 0,
              efficientMinutes: 0,
              inefficientMinutes: 0
            };
          }

          const multiplier = entry.app_categories?.efficiency_multiplier || 0;
          acc[date].totalMinutes += entry.time_spent_minutes;
          
          if (multiplier > 0) {
            acc[date].efficientMinutes += entry.time_spent_minutes;
          } else if (multiplier < 0) {
            acc[date].inefficientMinutes += entry.time_spent_minutes;
          }

          return acc;
        }, {});

        // Calculate efficiency scores
        const historyData = Object.values(grouped).map(day => {
          const productivePercentage = day.totalMinutes > 0 
            ? (day.efficientMinutes / day.totalMinutes) * 100 
            : 0;
          const unproductivePercentage = day.totalMinutes > 0 
            ? (day.inefficientMinutes / day.totalMinutes) * 100 
            : 0;
          
          return {
            ...day,
            efficiencyScore: Math.max(0, productivePercentage - unproductivePercentage)
          };
        });

        setHistory(historyData);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [isOpen, userId, period]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Your History
          </DialogTitle>
        </DialogHeader>

        <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="week">Last 7 Days</TabsTrigger>
            <TabsTrigger value="month">Last 30 Days</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="mt-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No data available for this period</div>
            ) : (
              <div className="space-y-2">
                {history.map((day) => (
                  <div key={day.date} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{formatDate(day.date)}</div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-4 h-4 ${
                          day.efficiencyScore > 50 ? 'text-success' : 'text-muted-foreground'
                        }`} />
                        <span className={`font-bold ${
                          day.efficiencyScore > 50 ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {Math.round(day.efficiencyScore)}%
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Total</div>
                        <div className="font-mono">
                          {Math.floor(day.totalMinutes / 60)}h {day.totalMinutes % 60}m
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Productive</div>
                        <div className="font-mono text-success">
                          {Math.floor(day.efficientMinutes / 60)}h {day.efficientMinutes % 60}m
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Wasted</div>
                        <div className="font-mono text-destructive">
                          {Math.floor(day.inefficientMinutes / 60)}h {day.inefficientMinutes % 60}m
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
