-- Database Schema Updates for Enhanced Golf Simulator
-- Run these commands in your Supabase SQL Editor

-- Add columns for shot spin and wind influence to the shots table
ALTER TABLE shots
ADD COLUMN IF NOT EXISTS ball_spin INTEGER,
ADD COLUMN IF NOT EXISTS wind_speed INTEGER,
ADD COLUMN IF NOT EXISTS wind_direction INTEGER,
ADD COLUMN IF NOT EXISTS lie_type TEXT;

-- Table for AI Coach Context and Memory
CREATE TABLE IF NOT EXISTS ai_coach_context (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tendency TEXT, -- e.g., 'slice', 'early_extension'
  last_advice TEXT,
  messages JSONB DEFAULT '[]'::jsonb, -- Store conversation history
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table for Challenges and Tournaments
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  course_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table for User Challenge Submissions
CREATE TABLE IF NOT EXISTS challenge_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_coach_context_user_id ON ai_coach_context(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_challenge_id ON challenge_entries(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_user_id ON challenge_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_shots_user_id ON shots(user_id);
CREATE INDEX IF NOT EXISTS idx_shots_session_id ON shots(session_id);