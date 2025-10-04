-- Update the efficiency calculation function to use the new percentage-based algorithm
-- New formula: (Productive Time / Total Time × 100) - (Unproductive Time / Total Time × 100)
CREATE OR REPLACE FUNCTION public.calculate_efficiency_score(p_user_id uuid, p_date date)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_score DECIMAL(8,2) := 0;
  v_total_time INTEGER := 0;
  v_productive_time INTEGER := 0;
  v_unproductive_time INTEGER := 0;
  v_productive_percentage DECIMAL(8,2) := 0;
  v_unproductive_percentage DECIMAL(8,2) := 0;
BEGIN
  -- Calculate total time and categorized time
  SELECT 
    COALESCE(SUM(ust.time_spent_minutes), 0) as total,
    COALESCE(SUM(CASE 
      WHEN ac.category = 'productive' THEN ust.time_spent_minutes 
      ELSE 0 
    END), 0) as productive,
    COALESCE(SUM(CASE 
      WHEN ac.category = 'unproductive' THEN ust.time_spent_minutes 
      ELSE 0 
    END), 0) as unproductive
  INTO v_total_time, v_productive_time, v_unproductive_time
  FROM public.user_screen_time ust
  LEFT JOIN public.app_categories ac ON ust.app_name = ac.app_name
  WHERE ust.user_id = p_user_id 
    AND ust.date = p_date;
  
  -- Calculate percentage-based efficiency score
  IF v_total_time > 0 THEN
    v_productive_percentage := (v_productive_time::DECIMAL / v_total_time) * 100;
    v_unproductive_percentage := (v_unproductive_time::DECIMAL / v_total_time) * 100;
    v_score := v_productive_percentage - v_unproductive_percentage;
    
    -- Ensure score is between -100 and 100
    v_score := GREATEST(-100, LEAST(100, v_score));
  END IF;
  
  RETURN v_score;
END;
$function$;

-- Recalculate all existing efficiency scores with the new algorithm
UPDATE public.profiles p
SET 
  efficiency_score = (
    SELECT AVG(calculate_efficiency_score(p.id, ust.date))
    FROM public.user_screen_time ust
    WHERE ust.user_id = p.id
    GROUP BY ust.user_id
  ),
  updated_at = now()
WHERE EXISTS (
  SELECT 1 FROM public.user_screen_time ust WHERE ust.user_id = p.id
);