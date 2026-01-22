-- =====================================================
-- VALIDATED MIGRATION: FIX INFINITE RECURSION
-- =====================================================

-- 1. DROP DEPENDENT POLICIES FIRST (Messages)
-- These policies depend on the function 'is_participant_in_conversation'
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "view_messages_in_my_conversations" ON messages;
DROP POLICY IF EXISTS "Participants can view messages" ON messages;

-- 2. DROP POLICIES ON CONVERSATION_PARTICIPANTS
-- These are the source of the recursion
DROP POLICY IF EXISTS "Users can view own participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversations they are in" ON conversation_participants;
DROP POLICY IF EXISTS "view_own_participation" ON conversation_participants;
DROP POLICY IF EXISTS "view_others_in_my_conversations" ON conversation_participants;

-- 3. DROP FUNCTION
DROP FUNCTION IF EXISTS is_participant_in_conversation;

-- 4. CREATE SECURE HELPER FUNCTION
-- SECURITY DEFINER: Runs with privileges of creator (postgres), bypassing RLS
-- SET search_path: Prevents search_path hijacking
CREATE OR REPLACE FUNCTION is_participant_in_conversation(_conversation_id UUID)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
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

-- 5. RE-CREATE POLICIES (Non-recursive)

-- A. Base Policy: View rows where YOU are the user
CREATE POLICY "view_own_participation"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- B. Recursive-Proof Policy: View other participants using the secure function
CREATE POLICY "view_others_in_my_conversations"
ON conversation_participants FOR SELECT
USING (is_participant_in_conversation(conversation_id));

-- 6. RE-CREATE MESSAGE POLICY
CREATE POLICY "view_messages_in_my_conversations"
ON messages FOR SELECT
USING (is_participant_in_conversation(conversation_id));
