-- Fix infinite recursion in memberships RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view memberships in their squads" ON memberships;

-- Create a simpler policy that allows authenticated users to view all memberships
-- This is appropriate for a squad app where squad memberships are visible
CREATE POLICY "Authenticated users can view all memberships"
ON memberships
FOR SELECT
USING (auth.uid() IS NOT NULL);