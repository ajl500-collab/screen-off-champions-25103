import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppUsage {
  app_name: string;
  time_spent_minutes: number;
  date: string;
  category?: string;
  efficiency_multiplier?: number;
}

interface ScreenTimeData {
  totalMinutes: number;
  efficientMinutes: number;
  inefficientMinutes: number;
  utilityMinutes: number;
  efficiencyScore: number;
  apps: AppUsage[];
}

export const useScreenTimeTracking = (userId: string | null, period: 'today' | 'week') => {
  const [data, setData] = useState<ScreenTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchScreenTime = async () => {
      try {
        const today = new Date();
        const startDate = period === 'today' 
          ? today.toISOString().split('T')[0]
          : new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Fetch screen time data
        const { data: screenTimeData, error: screenTimeError } = await supabase
          .from('user_screen_time')
          .select('*')
          .eq('user_id', userId)
          .gte('date', startDate)
          .order('date', { ascending: false });

        if (screenTimeError) throw screenTimeError;

        // Fetch all app categories separately
        const { data: categories, error: categoriesError } = await supabase
          .from('app_categories')
          .select('*');

        if (categoriesError) throw categoriesError;

        // Create a map of app categories for quick lookup
        const categoryMap = new Map(
          categories?.map(cat => [cat.app_name, cat]) || []
        );

        if (!screenTimeData || screenTimeData.length === 0) {
          // No data yet, return empty state
          setData({
            totalMinutes: 0,
            efficientMinutes: 0,
            inefficientMinutes: 0,
            utilityMinutes: 0,
            efficiencyScore: 0,
            apps: []
          });
          setLoading(false);
          return;
        }

        // Calculate totals
        let totalMinutes = 0;
        let efficientMinutes = 0;
        let inefficientMinutes = 0;
        let utilityMinutes = 0;
        let weightedScore = 0;

        const appMap = new Map<string, AppUsage>();

        screenTimeData.forEach((entry: any) => {
          const minutes = entry.time_spent_minutes;
          const appCat = categoryMap.get(entry.app_name);
          const category = appCat?.category || 'utility';
          const multiplier = appCat?.efficiency_multiplier || 0;

          totalMinutes += minutes;
          weightedScore += minutes * multiplier;

          // Categorize time
          if (multiplier > 0) {
            efficientMinutes += minutes;
          } else if (multiplier < 0) {
            inefficientMinutes += minutes;
          } else {
            utilityMinutes += minutes;
          }

          // Aggregate by app
          if (appMap.has(entry.app_name)) {
            const existing = appMap.get(entry.app_name)!;
            existing.time_spent_minutes += minutes;
          } else {
            appMap.set(entry.app_name, {
              app_name: entry.app_name,
              time_spent_minutes: minutes,
              date: entry.date,
              category,
              efficiency_multiplier: multiplier
            });
          }
        });

        const efficiencyScore = totalMinutes > 0 ? (weightedScore / totalMinutes) * 100 : 0;

        setData({
          totalMinutes,
          efficientMinutes,
          inefficientMinutes,
          utilityMinutes,
          efficiencyScore: Math.round(efficiencyScore),
          apps: Array.from(appMap.values()).sort((a, b) => b.time_spent_minutes - a.time_spent_minutes)
        });

      } catch (error) {
        console.error('Error fetching screen time:', error);
        toast({
          title: "Error",
          description: "Failed to load screen time data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScreenTime();

    // Set up realtime subscription for updates
    const channel = supabase
      .channel('screen-time-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_screen_time',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchScreenTime();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, period, toast]);

  return { data, loading };
};

export const trackAppUsage = async (
  userId: string,
  appName: string,
  minutes: number
) => {
  const today = new Date().toISOString().split('T')[0];

  // Check if app is categorized
  const { data: appCategory } = await supabase
    .from('app_categories')
    .select('*')
    .eq('app_name', appName)
    .maybeSingle();

  // If app is not categorized, categorize it with AI
  if (!appCategory) {
    console.log(`App ${appName} not categorized, calling AI...`);
    try {
      const { data: categoryData, error: categoryError } = await supabase.functions.invoke('categorize-app', {
        body: { appName }
      });

      if (categoryError) {
        console.error('Error categorizing app:', categoryError);
        // Continue anyway, the app will just not have a category
      } else {
        console.log(`Successfully categorized ${appName}:`, categoryData);
      }
    } catch (error) {
      console.error('Error calling categorize-app function:', error);
      // Continue anyway
    }
  }

  // Check if entry exists for today
  const { data: existing } = await supabase
    .from('user_screen_time')
    .select('*')
    .eq('user_id', userId)
    .eq('app_name', appName)
    .eq('date', today)
    .maybeSingle();

  if (existing) {
    // Update existing entry
    const { error } = await supabase
      .from('user_screen_time')
      .update({ time_spent_minutes: existing.time_spent_minutes + minutes })
      .eq('id', existing.id);
    
    if (error) throw error;
  } else {
    // Create new entry
    const { error } = await supabase
      .from('user_screen_time')
      .insert({
        user_id: userId,
        app_name: appName,
        time_spent_minutes: minutes,
        date: today
      });
    
    if (error) throw error;
  }
};
