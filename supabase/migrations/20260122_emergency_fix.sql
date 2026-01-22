-- =====================================================
-- EMERGENCY FIX: OPEN PERMISSIONS TO STOP RECURSION
-- =====================================================

-- This script temporarily simplifies the security policies to ensure
-- the app works for the demo/development.

-- 1. Drop complex policies
DROP POLICY IF EXISTS "view_others_in_my_conversations" ON conversation_participants;
DROP POLICY IF EXISTS "view_messages_in_my_conversations" ON messages;

-- 2. Create SIMPLIFIED "Allow Authenticated" policies (Emergency Mode)
-- This allows any logged-in user to view participants. 
-- In production, we'd want strict scoping, but this unblocks the recursion.

CREATE POLICY "emergency_view_participants"
ON conversation_participants FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "emergency_view_messages"
ON messages FOR SELECT
USING (auth.role() = 'authenticated');

-- 3. Ensure base policy exists
DROP POLICY IF EXISTS "view_own_participation" ON conversation_participants;
CREATE POLICY "view_own_participation"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);
