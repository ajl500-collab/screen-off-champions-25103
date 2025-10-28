-- Create tables for AI-generated content

-- Roast history table
CREATE TABLE IF NOT EXISTS public.roast_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  trigger_reason TEXT,
  efficiency_score DECIMAL(5,2),
  rank_delta INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Motivation history table
CREATE TABLE IF NOT EXISTS public.motivation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  trigger_reason TEXT,
  efficiency_score DECIMAL(5,2),
  streak_days INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly summary table
CREATE TABLE IF NOT EXISTS public.weekly_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  efficiency_change DECIMAL(5,2),
  top_productive_app TEXT,
  top_unproductive_app TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Squad insights table
CREATE TABLE IF NOT EXISTS public.squad_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL REFERENCES public.squads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roast_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.motivation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roast_history
CREATE POLICY "Users can view their own roasts"
  ON public.roast_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert roasts"
  ON public.roast_history
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for motivation_history
CREATE POLICY "Users can view their own motivations"
  ON public.motivation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert motivations"
  ON public.motivation_history
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for weekly_summary
CREATE POLICY "Users can view their own summaries"
  ON public.weekly_summary
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert summaries"
  ON public.weekly_summary
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for squad_insights
CREATE POLICY "Squad members can view insights"
  ON public.squad_insights
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.squad_id = squad_insights.squad_id
      AND memberships.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert squad insights"
  ON public.squad_insights
  FOR INSERT
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_roast_history_user_created ON public.roast_history(user_id, created_at DESC);
CREATE INDEX idx_motivation_history_user_created ON public.motivation_history(user_id, created_at DESC);
CREATE INDEX idx_weekly_summary_user_created ON public.weekly_summary(user_id, created_at DESC);
CREATE INDEX idx_squad_insights_squad_created ON public.squad_insights(squad_id, created_at DESC);