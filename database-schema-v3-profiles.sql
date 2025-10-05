-- Roxify Database Schema V3 - User Profiles & Preferences
-- Run this in your Supabase SQL editor
-- This migration adds user profiles with fitness level, goals, and workout preferences

-- ============================================================
-- STEP 1: Create User Profiles Table ^ 
-- ============================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Core User Info
    fitness_level VARCHAR(50) DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced'
    goals TEXT, -- User's training goals (free text)
    
    -- Workout Generation Defaults (optional - used as defaults in GeneratorForm)
    default_mood VARCHAR(50), -- 'fresh', 'normal', 'tired', 'exhausted' (nullable)
    default_intensity VARCHAR(50), -- 'light', 'moderate', 'hard', 'beast' (nullable)
    default_duration INTEGER DEFAULT 60, -- 30, 45, 60, or 90 minutes
    excluded_stations JSONB DEFAULT '[]'::jsonb, -- Array of station names to exclude by default
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STEP 2: Create Indexes ^
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_fitness_level ON user_profiles(fitness_level);

-- ============================================================
-- STEP 3: Enable Row Level Security (RLS) ^
-- ============================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 4: Create RLS Policies ^
-- ============================================================

-- Users can view their own profile ^
CREATE POLICY "Users can view their own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own profile (first time setup) ^ 
CREATE POLICY "Users can insert their own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
ON user_profiles FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- STEP 5: Create function to auto-update updated_at timestamp
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STEP 6: Verify Table
-- ============================================================

SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name = 'user_profiles'
ORDER BY table_name;

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. User profiles are optional - if no profile exists, app uses system defaults
-- 2. default_mood and default_intensity can be NULL (user can choose each time)
-- 3. excluded_stations is a JSONB array of station names (e.g., ["Sled Push", "Wall Balls"])
-- 4. fitness_level stored here for quick access (also in auth.users.user_metadata)
-- 5. RLS ensures users can only access their own profile
-- 6. updated_at is auto-updated on every UPDATE via trigger

