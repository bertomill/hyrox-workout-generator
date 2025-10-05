-- Hyrox Workout Generator Database Schema
-- Run this in your Supabase SQL editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    fitness_level VARCHAR(50) DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts Table
CREATE TABLE IF NOT EXISTS workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    workout_details JSONB NOT NULL, -- Stores full workout structure
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'skipped'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workout Logs Table
CREATE TABLE IF NOT EXISTS workout_logs (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_completed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performance_data JSONB NOT NULL, -- Stores performance for each station
    overall_time INTEGER, -- Total time in seconds
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_workout_id ON workout_logs(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_date_completed ON workout_logs(date_completed);

-- Insert a default test user for MVP (no authentication initially)
INSERT INTO users (email, name, fitness_level)
VALUES ('test@hyrox.app', 'Test User', 'intermediate')
ON CONFLICT (email) DO NOTHING;

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
