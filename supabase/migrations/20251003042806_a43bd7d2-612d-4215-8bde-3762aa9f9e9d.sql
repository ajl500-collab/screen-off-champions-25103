-- Add foreign key relationship between user_screen_time and app_categories
-- First, ensure app_name is the linking column

-- Add index on app_name in user_screen_time for better join performance
CREATE INDEX IF NOT EXISTS idx_user_screen_time_app_name ON public.user_screen_time(app_name);

-- Since we can't have a strict foreign key (apps might not exist in categories yet),
-- we'll rely on the application logic to handle this

-- Add a trigger to automatically update profile efficiency when screen time changes
CREATE OR REPLACE FUNCTION update_profile_on_screen_time_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate and update the user's profile
  UPDATE public.profiles
  SET 
    efficiency_score = (
      SELECT calculate_efficiency_score(NEW.user_id, NEW.date)
    ),
    total_screen_time_minutes = (
      SELECT COALESCE(SUM(time_spent_minutes), 0)
      FROM public.user_screen_time
      WHERE user_id = NEW.user_id
    ),
    updated_at = now()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for screen time updates
DROP TRIGGER IF EXISTS trigger_update_profile_on_screen_time ON public.user_screen_time;
CREATE TRIGGER trigger_update_profile_on_screen_time
  AFTER INSERT OR UPDATE ON public.user_screen_time
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_on_screen_time_change();