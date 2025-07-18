-- Initialize fuckupboard database
-- This script creates the table and index in the correct order

-- Create the fuckups table
CREATE TABLE IF NOT EXISTS fuckups (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user TEXT NOT NULL,
    desc TEXT,
    likes INTEGER DEFAULT 0
);

-- Create index for better performance on likes ordering
CREATE INDEX IF NOT EXISTS idx_fuckups_likes ON fuckups(likes DESC); 