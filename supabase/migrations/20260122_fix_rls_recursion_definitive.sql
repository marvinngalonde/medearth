-- =====================================================
-- Migration: Definitively Fix RLS Recursion
-- =====================================================

-- The recursion happens because checking "is_participant" queries the table
-- which then checks the policy, which calls the function, which queries the table...

-- 1. DROP ALL EXISTING PROBLEM POLICIES (Dependent ones first)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "view_messages_in_my_conversations" ON messages;

DROP POLICY IF EXISTS "Users can view own participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversations they are in" ON conversation_participants;

DROP FUNCTION IF EXISTS is_participant_in_conversation;

-- 2. CREATE A SECURE HELPER FUNCTION
-- This function MUST be SECURITY DEFINER to bypass RLS when called
-- AND it must NOT query the table in a way that triggers the policy recursively.
CREATE OR REPLACE FUNCTION is_participant_in_conversation(_conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- We use a direct check. Since this is SECURITY DEFINER, it bypasses RLS on the select.
  RETURN EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = _conversation_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CREATE NON-RECURSIVE POLICIES

-- Policy A: You can ALWAYS see rows where YOU are the user.
-- This is the base permission needed to even check your own participation.
CREATE POLICY "view_own_participation"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- Policy B: You can see OTHER participants IF you are also in that conversation.
-- We use the function which bypasses RLS to check membership safely.
CREATE POLICY "view_others_in_my_conversations"
ON conversation_participants FOR SELECT
USING (is_participant_in_conversation(conversation_id));

-- 4. FIX MESSAGES POLICIES
CREATE POLICY "view_messages_in_my_conversations"
ON messages FOR SELECT
USING (is_participant_in_conversation(conversation_id));
