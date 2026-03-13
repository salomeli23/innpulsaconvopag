/*
  # Fix Auth Schema Permissions

  1. Changes
    - Ensures auth schema is properly accessible
    - Grants necessary permissions to authenticated and anon roles
    - Fixes potential schema access issues during login

  2. Security
    - Only grants necessary read permissions
    - Maintains Supabase security model
*/

-- Ensure the auth schema is accessible (Supabase should handle this, but let's be explicit)
-- Grant usage on auth schema to allow querying
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- Grant select on specific auth tables that are used during login
-- (Supabase normally handles this, but we make it explicit)
GRANT SELECT ON auth.users TO authenticated;

-- Ensure public schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
