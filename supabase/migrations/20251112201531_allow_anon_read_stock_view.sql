/*
  # Allow anonymous users to read stock view

  1. Changes
    - Add policy to allow anon users to SELECT from stock table
    - This is needed to view product availability on the public website

  2. Security
    - Anon can only SELECT (read stock)
    - Cannot modify stock
    - This allows stock_productos view to work for public users
*/

-- Allow anonymous users to view stock (for product availability)
CREATE POLICY "Anon can view stock"
  ON stock FOR SELECT
  TO anon
  USING (true);
