-- =====================================================
-- THE REAL FIX: SECURE RLS (NO RECURSION)
-- =====================================================

-- 1. RE-ENABLE SECURITY (Undo the diagnostic disable)
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Ensure the table owner (postgres) bypasses RLS.
-- If this was set to FORCE, the SECURITY DEFINER function would still trigger recursion.
ALTER TABLE conversation_participants NO FORCE ROW LEVEL SECURITY;

-- 2. RESET POLICIES (Drop all previous attempts)
DROP POLICY IF EXISTS "emergency_view_participants" ON conversation_participants;
DROP POLICY IF EXISTS "emergency_view_messages" ON messages;
DROP POLICY IF EXISTS "view_others_in_my_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "view_messages_in_my_conversations" ON messages;
DROP POLICY IF EXISTS "view_own_participation" ON conversation_participants;
DROP POLICY IF EXISTS "p1_see_own_rows" ON conversation_participants;
DROP POLICY IF EXISTS "p2_see_others" ON conversation_participants;
DROP POLICY IF EXISTS "p3_see_messages" ON messages;

-- 3. DROP & RECREATE SECURE FUNCTION
DROP FUNCTION IF EXISTS is_participant_in_conversation;

CREATE OR REPLACE FUNCTION is_participant_in_conversation(_conversation_id UUID)
RETURNS BOOLEAN 
SECURITY DEFINER          -- Runs as Database Owner (bypasses RLS)
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- This query runs with Admin privileges.
  -- Because we set "NO FORCE ROW LEVEL SECURITY", it reads the table directly
  -- without checking any policies, preventing the infinite loop.
  RETURN EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = _conversation_id 
    AND user_id = auth.uid()
  );
END;
$$;

-- 4. APPLY SECURE POLICIES

-- Policy A: You can always see YOUR OWN rows.
CREATE POLICY "secure_view_own"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- Policy B: You can see OTHERS if you are in the conversation.
-- This calls the function -> function becomes Admin -> Admin reads table -> Returns True/False.
-- No recursion loop.
CREATE POLICY "secure_view_others"
ON conversation_participants FOR SELECT
USING (is_participant_in_conversation(conversation_id));

-- Policy C: You can see MESSAGES if you are in the conversation.
CREATE POLICY "secure_view_messages"
ON messages FOR SELECT
USING (is_participant_in_conversation(conversation_id));
