-- Remove the foreign key constraint that's blocking new app entries
ALTER TABLE public.user_screen_time 
DROP CONSTRAINT IF EXISTS fk_user_screen_time_app_categories;

-- Add an index for better performance when looking up app categories
CREATE INDEX IF NOT EXISTS idx_user_screen_time_app_name ON public.user_screen_time(app_name);