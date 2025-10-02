-- Add foreign key relationship between user_screen_time and app_categories
ALTER TABLE public.user_screen_time
ADD CONSTRAINT fk_user_screen_time_app_categories
FOREIGN KEY (app_name)
REFERENCES public.app_categories(app_name)
ON DELETE SET NULL;

-- Add foreign key relationship between chat_messages and profiles
ALTER TABLE public.chat_messages
ADD CONSTRAINT fk_chat_messages_user_id
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_user_screen_time_app_name ON public.user_screen_time(app_name);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);