-- Create enum for app categories
CREATE TYPE app_category AS ENUM ('productive', 'unproductive', 'utility');

-- Create app categories table with efficiency multipliers
CREATE TABLE public.app_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name TEXT NOT NULL UNIQUE,
  category app_category NOT NULL,
  efficiency_multiplier DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  total_screen_time_minutes INTEGER DEFAULT 0,
  efficiency_score DECIMAL(8,2) DEFAULT 0,
  team_name TEXT,
  avatar_emoji TEXT DEFAULT '😎',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user screen time tracking table
CREATE TABLE public.user_screen_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  time_spent_minutes INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, app_name, date)
);

-- Enable RLS on all tables
ALTER TABLE public.app_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_screen_time ENABLE ROW LEVEL SECURITY;

-- RLS Policies for app_categories (read-only for all authenticated users)
CREATE POLICY "Anyone can view app categories"
  ON public.app_categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_screen_time
CREATE POLICY "Users can view all screen time data"
  ON public.user_screen_time FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own screen time"
  ON public.user_screen_time FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own screen time"
  ON public.user_screen_time FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed app categories with efficiency multipliers
-- Productive apps: positive multipliers
INSERT INTO public.app_categories (app_name, category, efficiency_multiplier) VALUES
  ('LinkedIn', 'productive', 1.5),
  ('Bloomberg', 'productive', 1.5),
  ('Wall Street Journal', 'productive', 1.5),
  ('New York Times', 'productive', 1.3),
  ('Robinhood', 'productive', 1.2),
  ('Notion', 'productive', 1.4),
  ('Kindle', 'productive', 1.5),
  ('Duolingo', 'productive', 1.3),
  ('Gmail', 'productive', 0.8),
  ('Slack', 'productive', 0.9);

-- Unproductive apps: negative multipliers
INSERT INTO public.app_categories (app_name, category, efficiency_multiplier) VALUES
  ('Instagram', 'unproductive', -1.5),
  ('TikTok', 'unproductive', -2.0),
  ('Facebook', 'unproductive', -1.3),
  ('Twitter', 'unproductive', -1.2),
  ('Snapchat', 'unproductive', -1.4),
  ('Reddit', 'unproductive', -1.1),
  ('YouTube', 'unproductive', -1.0),
  ('Candy Crush', 'unproductive', -1.8),
  ('Call of Duty', 'unproductive', -1.6),
  ('Fortnite', 'unproductive', -1.7);

-- Utility apps: zero multiplier (neutral)
INSERT INTO public.app_categories (app_name, category, efficiency_multiplier) VALUES
  ('Clock', 'utility', 0),
  ('Messages', 'utility', 0),
  ('Phone', 'utility', 0),
  ('Calendar', 'utility', 0),
  ('Maps', 'utility', 0),
  ('Weather', 'utility', 0),
  ('Calculator', 'utility', 0),
  ('Settings', 'utility', 0);

-- Function to calculate efficiency score
CREATE OR REPLACE FUNCTION calculate_efficiency_score(p_user_id UUID, p_date DATE)
RETURNS DECIMAL(8,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_score DECIMAL(8,2) := 0;
  v_total_time INTEGER := 0;
  v_weighted_time DECIMAL(10,2) := 0;
BEGIN
  -- Calculate weighted time based on app categories
  SELECT 
    COALESCE(SUM(ust.time_spent_minutes), 0),
    COALESCE(SUM(ust.time_spent_minutes * COALESCE(ac.efficiency_multiplier, 0)), 0)
  INTO v_total_time, v_weighted_time
  FROM public.user_screen_time ust
  LEFT JOIN public.app_categories ac ON ust.app_name = ac.app_name
  WHERE ust.user_id = p_user_id 
    AND ust.date = p_date;
  
  -- Calculate efficiency score
  -- Formula: (weighted_time / total_time) * 100
  -- This gives a percentage score where positive = productive, negative = unproductive
  IF v_total_time > 0 THEN
    v_score := (v_weighted_time / v_total_time) * 100;
  END IF;
  
  RETURN v_score;
END;
$$;

-- Function to update profile efficiency score
CREATE OR REPLACE FUNCTION update_profile_efficiency()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_efficiency_score DECIMAL(8,2);
  v_total_time INTEGER;
BEGIN
  -- Calculate current efficiency score
  v_efficiency_score := calculate_efficiency_score(NEW.user_id, NEW.date);
  
  -- Get total screen time for the date
  SELECT COALESCE(SUM(time_spent_minutes), 0)
  INTO v_total_time
  FROM public.user_screen_time
  WHERE user_id = NEW.user_id 
    AND date = NEW.date;
  
  -- Update profile
  UPDATE public.profiles
  SET 
    efficiency_score = v_efficiency_score,
    total_screen_time_minutes = v_total_time,
    updated_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update profile when screen time is added/updated
CREATE TRIGGER update_profile_on_screen_time
  AFTER INSERT OR UPDATE ON public.user_screen_time
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_efficiency();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Player')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();