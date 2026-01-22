-- =====================================================
-- Migration: FORCE FIX RLS (Recursion)
-- =====================================================

-- 1. Helper function (Security Definer to bypass RLS recursion)
CREATE OR REPLACE FUNCTION is_participant_in_conversation(_conversation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM conversation_participants 
    WHERE conversation_id = _conversation_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Clean up Policies (DROP EVERYTHING to be safe)
DROP POLICY IF EXISTS "Users can view own participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view conversations they are in" ON conversation_participants;

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;

-- 3. Re-create Policies (Correct Non-Recursive logic)

-- Policy A: Simple check on own user_id
CREATE POLICY "Users can view own participation"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- Policy B: Check partial membership using the helper function
CREATE POLICY "Users can view participants of their conversations"
ON conversation_participants FOR SELECT
USING (is_participant_in_conversation(conversation_id));

-- Policy C: Messages
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (is_participant_in_conversation(conversation_id));

-- 4. DOCTORS (Ensure they are public)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active doctors are viewable by everyone" ON doctors;
CREATE POLICY "Active doctors are viewable by everyone" ON doctors FOR SELECT USING (true);
