-- =====================================================
-- Migration: Ecosystem Expansion (Feed & Jobs)
-- =====================================================

-- 1. POSTS TABLE (For the Medical Feed)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    author_role TEXT, -- Cache the role at time of posting (e.g. 'doctor', 'admin')
    content TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_verified_post BOOLEAN DEFAULT FALSE, -- Blue tick for doctor/official posts
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- 2. POST LIKES
CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- 3. POST COMMENTS
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON post_comments(post_id);

-- 4. JOBS TABLE
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Who posted it
    title TEXT NOT NULL,
    organization TEXT NOT NULL, -- Hospital/Clinic Name
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Full-time', 'Locum', 'Volunteer', 'Part-time'
    salary_range TEXT, -- e.g. "$50k - $80k" or "Volunteer"
    description TEXT,
    requirements TEXT[], -- Array of strings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_active ON jobs(is_active) WHERE is_active = TRUE;

-- 5. JOB APPLICATIONS
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'rejected', 'interview'
    cover_note TEXT,
    resume_url TEXT, -- Link to storage
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);

-- RLS POLICIES -----------------------------------------

-- Posts: Everyone can view, specific roles can Create
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Professionals can create posts" ON posts FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND (
           'doctor' = ANY(roles) OR
           'pharmacy' = ANY(roles) OR 
           'admin' = ANY(roles)
        )
    )
);

-- Jobs: Everyone can view
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active jobs" ON jobs FOR SELECT USING (is_active = true);

-- Applications: Applicant can view own, Employer can view received
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicant can view own" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Employer can view applications" ON job_applications FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM jobs WHERE id = job_applications.job_id AND employer_id = auth.uid()
    )
);
