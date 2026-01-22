-- =====================================================
-- PRODUCTION FIX: TRANSITION FROM EMERGENCY TO SECURE
-- =====================================================

-- 1. CLEANUP: Drop "Emergency" and "Broken" Policies
-- We drop everything to ensure a clean slate.
DROP POLICY IF EXISTS "emergency_view_participants" ON conversation_participants;
DROP POLICY IF EXISTS "emergency_view_messages" ON messages;
DROP POLICY IF EXISTS "view_others_in_my_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "view_messages_in_my_conversations" ON messages;
DROP POLICY IF EXISTS "view_own_participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view own participation" ON conversation_participants;

-- 2. CLEANUP: Drop the Function (to update it)
DROP FUNCTION IF EXISTS is_participant_in_conversation;

-- 3. SECURE FUNCTION (The Production Solution)
-- This function runs as the database owner (SECURITY DEFINER), 
-- allowing it to check the table WITHOUT triggering the user's RLS policy.
CREATE OR REPLACE FUNCTION is_participant_in_conversation(_conversation_id UUID)
RETURNS BOOLEAN 
SECURITY DEFINER          -- <--- Important: Bypasses RLS recursion
SET search_path = public  -- <--- Important: Security best practice
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = _conversation_id 
    AND user_id = auth.uid()
  );
END;
$$;

-- 4. STRICT POLICIES (Production Ready)

-- A. Conversation Participants
-- Rule: You can always see rows that belong to YOU.
CREATE POLICY "view_own_participation"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- Rule: You can see OTHER participants ONLY if you are in the same conversation.
-- Uses the secure function to check membership without looping.
CREATE POLICY "view_others_in_my_conversations"
ON conversation_participants FOR SELECT
USING (is_participant_in_conversation(conversation_id));

-- B. Messages
-- Rule: You can see messages ONLY if you are a participant in the conversation.
CREATE POLICY "view_messages_in_my_conversations"
ON messages FOR SELECT
USING (is_participant_in_conversation(conversation_id));
