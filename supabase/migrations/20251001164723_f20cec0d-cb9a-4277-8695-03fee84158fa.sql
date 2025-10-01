-- Fix search path for calculate_efficiency_score function
CREATE OR REPLACE FUNCTION calculate_efficiency_score(p_user_id UUID, p_date DATE)
RETURNS DECIMAL(8,2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  IF v_total_time > 0 THEN
    v_score := (v_weighted_time / v_total_time) * 100;
  END IF;
  
  RETURN v_score;
END;
$$;

-- Fix search path for update_profile_efficiency function
CREATE OR REPLACE FUNCTION update_profile_efficiency()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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