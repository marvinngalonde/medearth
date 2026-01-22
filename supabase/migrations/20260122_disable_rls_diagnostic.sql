-- =====================================================
-- DIAGNOSTIC: DISABLE RLS COMPLETELY
-- =====================================================

-- Verify if the error persists even with RLS disabled.
-- If this fixes it, the previous policies were definitely the issue.
-- If this DOES NOT fix it, there is a ghost policy or trigger.

ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;

-- Also try dropping the policy explicitly again just in case
DROP POLICY IF EXISTS "emergency_view_participants" ON conversation_participants;
DROP POLICY IF EXISTS "view_others_in_my_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "view_own_participation" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view own participation" ON conversation_participants;
DROP POLICY IF EXISTS "p1_see_own_rows" ON conversation_participants;
DROP POLICY IF EXISTS "p2_see_others" ON conversation_participants;
