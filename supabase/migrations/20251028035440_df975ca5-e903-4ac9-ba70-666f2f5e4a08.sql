-- Create squads table
CREATE TABLE IF NOT EXISTS public.squads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  squad_id uuid REFERENCES public.squads(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  UNIQUE (user_id, squad_id)
);

-- Create daily_usage aggregates table
CREATE TABLE IF NOT EXISTS public.daily_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  usage_date date NOT NULL,
  productive_mins int NOT NULL DEFAULT 0,
  unproductive_mins int NOT NULL DEFAULT 0,
  neutral_mins int NOT NULL DEFAULT 0,
  source text CHECK (source IN ('manual','csv','webhook')) DEFAULT 'manual',
  inserted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, usage_date)
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text DEFAULT 'free',
  sync_connected boolean DEFAULT false,
  sync_last_updated timestamptz,
  bio text,
  ingest_token_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for squads
CREATE POLICY "Users can view squads they are members of"
ON public.squads FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.squad_id = squads.id
    AND memberships.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create squads"
ON public.squads FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Squad creators can update their squads"
ON public.squads FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Squad creators can delete their squads"
ON public.squads FOR DELETE
USING (auth.uid() = created_by);

-- RLS Policies for memberships
CREATE POLICY "Users can view memberships in their squads"
ON public.memberships FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.squad_id = memberships.squad_id
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join squads"
ON public.memberships FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave squads"
ON public.memberships FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for daily_usage
CREATE POLICY "Users can view their own usage data"
ON public.daily_usage FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own usage data"
ON public.daily_usage FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own usage data"
ON public.daily_usage FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own usage data"
ON public.daily_usage FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for settings
CREATE POLICY "Users can view their own settings"
ON public.settings FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own settings"
ON public.settings FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own settings"
ON public.settings FOR UPDATE
USING (user_id = auth.uid());

-- Create function to generate invite codes
CREATE OR REPLACE FUNCTION public.generate_squad_invite_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_squads_updated_at
BEFORE UPDATE ON public.squads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_usage_updated_at
BEFORE UPDATE ON public.daily_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_squad_id ON public.memberships(squad_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, usage_date DESC);
CREATE INDEX IF NOT EXISTS idx_squads_invite_code ON public.squads(invite_code);