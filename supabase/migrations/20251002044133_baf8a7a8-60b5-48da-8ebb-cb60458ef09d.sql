-- Add goal management columns to user_goals table
ALTER TABLE public.user_goals 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE, 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;