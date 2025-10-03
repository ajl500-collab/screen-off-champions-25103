-- Fix security issue: Restrict profiles table access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new policy: Authenticated users can view profiles
-- This allows leaderboards and community features to work while requiring authentication
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Keep the existing policies for insert and update (users manage their own profile)
-- These are already correct and don't need changes