-- Create enum for competition modes
CREATE TYPE public.competition_mode AS ENUM ('solo', 'duo', 'trio', 'random');

-- Competition settings for users
CREATE TABLE public.competition_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_mode competition_mode NOT NULL DEFAULT 'random',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Weekly themes for team names
CREATE TABLE public.weekly_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_name TEXT NOT NULL,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(week_start)
);

-- Teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  team_size INTEGER NOT NULL CHECK (team_size IN (1, 2, 3)),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  average_efficiency NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Team members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_type TEXT NOT NULL CHECK (chat_type IN ('community', 'team')),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('text', 'image', 'gif', 'voice')),
  content TEXT NOT NULL,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User goals
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_text TEXT NOT NULL,
  target_efficiency INTEGER,
  target_screen_time_minutes INTEGER,
  ai_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.competition_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for competition_settings
CREATE POLICY "Users can view their own settings"
ON public.competition_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.competition_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.competition_settings FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for weekly_themes
CREATE POLICY "Anyone can view themes"
ON public.weekly_themes FOR SELECT
USING (true);

-- RLS Policies for teams
CREATE POLICY "Anyone can view teams"
ON public.teams FOR SELECT
USING (true);

-- RLS Policies for team_members
CREATE POLICY "Anyone can view team members"
ON public.team_members FOR SELECT
USING (true);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view community messages"
ON public.chat_messages FOR SELECT
USING (chat_type = 'community' OR (chat_type = 'team' AND team_id IN (
  SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
)));

CREATE POLICY "Users can insert messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_goals
CREATE POLICY "Users can view their own goals"
ON public.user_goals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
ON public.user_goals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
ON public.user_goals FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_chat_messages_chat_type ON public.chat_messages(chat_type);
CREATE INDEX idx_chat_messages_team_id ON public.chat_messages(team_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_teams_week_start ON public.teams(week_start);