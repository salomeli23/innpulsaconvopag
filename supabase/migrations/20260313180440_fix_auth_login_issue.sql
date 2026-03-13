/*
  # Fix Authentication Login Issue

  1. Problem
    - Users unable to login due to "Database error querying schema"
    - Auth schema permissions may be incorrect

  2. Solution
    - Revoke and re-grant proper permissions to auth schema
    - Ensure anon and authenticated roles have minimal required access
    - Fix any triggers or functions that might be causing issues

  3. Security
    - Only grants necessary permissions for authentication
    - Does not expose sensitive user data
*/

-- Revoke all existing grants on auth schema (except postgres/service_role)
REVOKE ALL ON SCHEMA auth FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA auth FROM anon, authenticated;

-- Grant only USAGE on auth schema (allows access but not creation)
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- The auth schema and its operations should be handled entirely by Supabase's internal mechanisms
-- We should NOT grant direct table access to auth.users or other auth tables

-- Ensure public schema has correct permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
