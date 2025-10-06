-- Add community_id to chat_messages for proper message scoping
ALTER TABLE public.chat_messages 
ADD COLUMN community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE;

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Users can view community messages" ON public.chat_messages;

-- Create new secure policy that checks community membership
CREATE POLICY "Users can view community messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  -- For community messages, user must be a member of that community
  (chat_type = 'community' AND community_id IS NOT NULL AND community_id IN (
    SELECT community_id 
    FROM public.community_members 
    WHERE user_id = auth.uid()
  ))
  OR
  -- For team messages, user must be a member of that team
  (chat_type = 'team' AND team_id IN (
    SELECT team_id 
    FROM public.team_members 
    WHERE user_id = auth.uid()
  ))
  OR
  -- Allow global community messages (backward compatibility) only for community members
  (chat_type = 'community' AND community_id IS NULL AND EXISTS (
    SELECT 1 
    FROM public.community_members 
    WHERE user_id = auth.uid()
  ))
);

-- Update insert policy to validate community_id
DROP POLICY IF EXISTS "Users can insert messages" ON public.chat_messages;

CREATE POLICY "Users can insert messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    -- For community messages, must be a member if community_id is specified
    (chat_type = 'community' AND (
      (community_id IS NULL AND EXISTS (
        SELECT 1 FROM public.community_members WHERE user_id = auth.uid()
      ))
      OR
      (community_id IS NOT NULL AND community_id IN (
        SELECT community_id FROM public.community_members WHERE user_id = auth.uid()
      ))
    ))
    OR
    -- For team messages, must be a member of that team
    (chat_type = 'team' AND team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    ))
  )
);