-- =====================================================
-- NUCLEAR FIX: RESET ALL MESSAGING SECURITY
-- =====================================================

-- We are going to DROP everything related to messaging security and rebuild it specific way.
-- Use this if the previous "Production Fix" didn't work.

-- 1. DROP EVERYTHING (Policies)
DROP POLICY IF EXISTS "emergency_view_participants" ON conversation_participants;
DROP POLICY IF EXISTS "emergency_view_messages" ON messages;
DROP POLICY IF EXISTS "view_others_in_my_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "view_messages_in_my_conversations" ON messages;
DROP POLICY IF EXISTS "view_own_participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view own participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversations they are in" ON conversation_participants;
DROP POLICY IF EXISTS "Participants can view messages" ON messages;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;

-- 2. DROP FUNCTION
DROP FUNCTION IF EXISTS is_participant_in_conversation;

-- 3. RE-ENABLE RLS (Just in case)
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 4. CREATE SECURE FUNCTION (With explicit Owner check logic)
CREATE OR REPLACE FUNCTION is_participant_in_conversation(_conversation_id UUID)
RETURNS BOOLEAN 
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- We query the table directly.
  -- Because of SECURITY DEFINER, this runs as the table owner.
  RETURN EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = _conversation_id 
    AND user_id = auth.uid()
  );
END;
$$;

-- 5. CREATE SIMPLEST POSSIBLE POLICIES

-- Policy 1: See your own rows (Base)
CREATE POLICY "p1_see_own_rows"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: See others in your conversations (The Loop Risk)
-- Uses the function to break the loop.
CREATE POLICY "p2_see_others"
ON conversation_participants FOR SELECT
USING (is_participant_in_conversation(conversation_id));

-- Policy 3: See messages
CREATE POLICY "p3_see_messages"
ON messages FOR SELECT
USING (is_participant_in_conversation(conversation_id));
