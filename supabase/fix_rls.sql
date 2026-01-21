-- =====================================================
-- Fix RLS Policy for Profiles Table
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- 1. Allow authenticated users to insert their own profile
-- This is required because there is no automatic trigger creating profiles,
-- so the client application must perform the INSERT.
CREATE POLICY "Users can insert their own profile" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Verify settings (Optional)
-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
