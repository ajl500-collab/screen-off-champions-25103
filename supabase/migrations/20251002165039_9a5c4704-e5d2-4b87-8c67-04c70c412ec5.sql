-- Drop and recreate the trigger to ensure it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policy for user_goals DELETE (currently missing)
CREATE POLICY "Users can delete their own goals"
  ON public.user_goals
  FOR DELETE
  USING (auth.uid() = user_id);