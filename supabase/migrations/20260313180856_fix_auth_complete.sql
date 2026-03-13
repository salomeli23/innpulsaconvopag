/*
  # Fix Complete Auth Schema Issues

  1. Problem
    - "Database error checking email" during user creation/login
    - Auth schema permissions are still incorrect
    - Previous migrations may have caused conflicts

  2. Solution
    - Reset all auth schema permissions completely
    - Ensure Supabase's internal auth functions can execute properly
    - Grant minimal required permissions only

  3. Security
    - Auth operations handled by Supabase internally
    - No direct user table access granted
*/

-- First, revoke ALL permissions from auth schema to start fresh
DO $$ 
BEGIN
  -- Revoke schema permissions
  REVOKE ALL ON SCHEMA auth FROM PUBLIC, anon, authenticated;
  
  -- Revoke table permissions
  REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM PUBLIC, anon, authenticated;
  
  -- Revoke sequence permissions
  REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM PUBLIC, anon, authenticated;
  
  -- Revoke function permissions
  REVOKE ALL ON ALL FUNCTIONS IN SCHEMA auth FROM PUBLIC, anon, authenticated;
END $$;

-- Grant ONLY usage permission on auth schema
-- This allows Supabase's internal auth functions to work
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Ensure public schema has correct permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO anon;
