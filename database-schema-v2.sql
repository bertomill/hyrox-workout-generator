-- Roxify Database Schema V2 - Supabase Auth Integration
-- Run this in your Supabase SQL editor
-- This migration updates the schema to use Supabase Auth (UUID) instead of custom users table

-- ============================================================
-- STEP 1: Drop old tables (if starting fresh) OR migrate data
-- ============================================================

-- Option A: If you want to keep old data, rename tables first:
-- ALTER TABLE IF EXISTS workouts RENAME TO workouts_old;
-- ALTER TABLE IF EXISTS workout_logs RENAME TO workout_logs_old;
-- ALTER TABLE IF EXISTS users RENAME TO users_old;

-- Option B: If starting fresh (CAUTION: This deletes all data):
DROP TABLE IF EXISTS workout_logs CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- STEP 2: Create Workouts Table (with UUID user_id)
-- ============================================================

CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    workout_details JSONB NOT NULL, -- Stores full workout structure
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'skipped'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STEP 3: Create Workout Logs Table (with UUID user_id)
-- ============================================================

CREATE TABLE IF NOT EXISTS workout_logs (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date_completed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performance_data JSONB NOT NULL, -- Stores performance for each station
    overall_time INTEGER, -- Total time in seconds
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- STEP 4: Create Indexes for Performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_status ON workouts(status);
CREATE INDEX IF NOT EXISTS idx_workouts_date_generated ON workouts(date_generated DESC);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_workout_id ON workout_logs(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date_completed ON workout_logs(date_completed DESC);

-- ============================================================
-- STEP 5: Enable Row Level Security (RLS)
-- ============================================================

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 6: Create RLS Policies
-- ============================================================

-- Workouts: Users can only see their own workouts
CREATE POLICY "Users can view their own workouts"
ON workouts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
ON workouts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
ON workouts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
ON workouts FOR DELETE
USING (auth.uid() = user_id);

-- Workout Logs: Users can only see their own logs
CREATE POLICY "Users can view their own workout logs"
ON workout_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs"
ON workout_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs"
ON workout_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs"
ON workout_logs FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- STEP 7: Verify Tables
-- ============================================================

SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('workouts', 'workout_logs')
ORDER BY table_name;

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. The auth.users table is managed by Supabase automatically
-- 2. User metadata (like fitness_level, name) is stored in auth.users.user_metadata
-- 3. RLS policies ensure users can only access their own data
-- 4. UUID is the standard for Supabase Auth user IDs
-- 5. If you need to migrate old data, use the workouts_old and workout_logs_old tables
