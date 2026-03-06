/*
  # Add Performance Indexes

  1. Changes
    - Add index on is_active column for faster filtering
    - Add index on status column for faster filtering
    - Add index on created_at for faster sorting

  2. Performance
    - These indexes will significantly speed up the main queries
    - Composite index for common query patterns
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_convocatorias_is_active ON convocatorias(is_active);
CREATE INDEX IF NOT EXISTS idx_convocatorias_status ON convocatorias(status);
CREATE INDEX IF NOT EXISTS idx_convocatorias_created_at ON convocatorias(created_at DESC);

-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_convocatorias_active_created 
ON convocatorias(is_active, created_at DESC) 
WHERE is_active = true;
