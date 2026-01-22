-- =====================================================
-- Migration: Fix RLS & Integrate Doctors
-- =====================================================

-- 1. FIX INFINITE RECURSION IN CONVERSATION_PARTICIPANTS
-- The error "infinite recursion detected in policy for relation conversation_participants"
-- happens when a policy queries the same table it protects in a way that loops.

-- Drop existing problematic policies on conversation_participants
DROP POLICY IF EXISTS "Users can view conversations they are in" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON conversation_participants;

-- Correct simple policy: Users can see rows where THEY are the user_id.
CREATE POLICY "Users can view own participation"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- Also allow users to see OTHER participants in conversations they belong to.
-- This was likely the cause of recursion. We need to be careful.
-- Strategy: Use a SECURITY DEFINER function to break the recursion loop.

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

CREATE POLICY "Users can view participants of their conversations"
ON conversation_participants FOR SELECT
USING (is_participant_in_conversation(conversation_id));


-- 2. FIX MESSAGES RLS (Just in case)
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (is_participant_in_conversation(conversation_id));


-- 3. ENSURE DOCTORS TABLE EXISTS AND HAS DATA (For the Integration)
-- (This part assumes table was created in previous schema, just ensuring policies are open)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active doctors are viewable by everyone" ON doctors;
CREATE POLICY "Active doctors are viewable by everyone" ON doctors FOR SELECT USING (true); -- Public profile

-- 4. INSERT MOCK REAL DATA FOR DOCTORS (If empty)
INSERT INTO doctors (name, specialty, location, consultation_fee, rating, experience_years)
SELECT 'Dr. Sarah Smith', 'Cardiologist', 'Central Hospital', 120.00, 4.9, 15
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. Sarah Smith');

INSERT INTO doctors (name, specialty, location, consultation_fee, rating, experience_years)
SELECT 'Dr. John Doe', 'General Practitioner', 'Westside Clinic', 80.00, 4.5, 8
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE name = 'Dr. John Doe');
