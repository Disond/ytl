-- Migration: Add user_id column to task table
-- This migration adds a user_id foreign key to the task table
-- so that each task is associated with a specific user

-- Add user_id column if it doesn't exist
ALTER TABLE task 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Create index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_task_user_id ON task(user_id);

-- Optional: If you want to set existing tasks to a default user (e.g., first user)
-- Uncomment the line below and replace 1 with the actual user ID
-- UPDATE task SET user_id = 1 WHERE user_id IS NULL;

