/*
  # Optimize Query Performance
  
  1. Changes
    - Analyze tables to update statistics
    - Optimize RLS policy execution
    
  2. Performance Improvements
    - Reduces planning time for queries
    - Updates table statistics for better query planning
    - Improves overall database performance
*/

-- Analyze tables to update statistics
ANALYZE convocatorias;
ANALYZE convocatoria_terms;

-- Update autovacuum settings for better performance
ALTER TABLE convocatorias SET (
  autovacuum_analyze_scale_factor = 0.05,
  autovacuum_vacuum_scale_factor = 0.1
);

ALTER TABLE convocatoria_terms SET (
  autovacuum_analyze_scale_factor = 0.05,
  autovacuum_vacuum_scale_factor = 0.1
);

-- Create a function to optimize RLS checks
CREATE OR REPLACE FUNCTION public.is_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_authenticated() TO authenticated, anon;
