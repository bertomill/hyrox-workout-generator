-- Roxify Database Schema V4 - User-Created Workouts
-- Run this in your Supabase SQL editor
-- This migration adds support for user-created workouts and AI-enhanced variations

-- ============================================================
-- STEP 1: Add source field to workouts table
-- ============================================================

-- Add source column to distinguish workout origins
ALTER TABLE workouts 
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'ai_generated';

-- Add workout name/title for user-created workouts
ALTER TABLE workouts 
ADD COLUMN IF NOT EXISTS workout_name VARCHAR(255);

-- Add description for user-created workouts
ALTER TABLE workouts 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add tags for categorization (e.g., "strength", "endurance", "competition")
ALTER TABLE workouts 
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- ============================================================
-- STEP 2: Update existing workouts to have proper source
-- ============================================================

-- Set all existing workouts as AI-generated (they were created by the AI system)
UPDATE workouts 
SET source = 'ai_generated' 
WHERE source IS NULL;

-- ============================================================
-- STEP 3: Create indexes for new fields
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_workouts_source ON workouts(source);
CREATE INDEX IF NOT EXISTS idx_workouts_workout_name ON workouts(workout_name);
CREATE INDEX IF NOT EXISTS idx_workouts_tags ON workouts USING GIN(tags);

-- ============================================================
-- STEP 4: Add constraints
-- ============================================================

-- Ensure source is one of the valid values
ALTER TABLE workouts 
ADD CONSTRAINT check_source_valid 
CHECK (source IN ('ai_generated', 'user_created', 'ai_enhanced'));

-- ============================================================
-- STEP 5: Create function to get user's custom workouts
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_custom_workouts(user_uuid UUID)
RETURNS TABLE (
    id INTEGER,
    workout_name VARCHAR(255),
    description TEXT,
    workout_details JSONB,
    tags JSONB,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.workout_name,
        w.description,
        w.workout_details,
        w.tags,
        w.created_at
    FROM workouts w
    WHERE w.user_id = user_uuid 
    AND w.source = 'user_created'
    ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STEP 6: Create function to get AI-enhanced workouts
-- ============================================================

CREATE OR REPLACE FUNCTION get_ai_enhanced_workouts(user_uuid UUID)
RETURNS TABLE (
    id INTEGER,
    workout_name VARCHAR(255),
    description TEXT,
    workout_details JSONB,
    tags JSONB,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.workout_name,
        w.description,
        w.workout_details,
        w.tags,
        w.created_at
    FROM workouts w
    WHERE w.user_id = user_uuid 
    AND w.source = 'ai_enhanced'
    ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- STEP 7: Verify the migration
-- ============================================================

-- Check that the new columns were added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'workouts' 
AND table_schema = 'public'
AND column_name IN ('source', 'workout_name', 'description', 'tags')
ORDER BY column_name;

-- Check the constraint was added
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'workouts' 
AND table_schema = 'public'
AND constraint_name = 'check_source_valid';

-- ============================================================
-- NOTES:
-- ============================================================
-- 1. source field values:
--    - 'ai_generated': Created by AI system (default)
--    - 'user_created': Created by user in workout builder
--    - 'ai_enhanced': AI variations of user's custom workouts
--
-- 2. workout_name: User-friendly name for custom workouts
-- 3. description: Optional description of the workout
-- 4. tags: JSONB array for categorization (e.g., ["strength", "competition"])
-- 5. Functions provide easy access to user's custom and AI-enhanced workouts
-- 6. All existing workouts are marked as 'ai_generated' by default
