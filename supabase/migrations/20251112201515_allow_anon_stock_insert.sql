/*
  # Allow anonymous users to insert stock movements

  1. Changes
    - Add policy to allow anon users to INSERT into stock table
    - This is needed when creating orders (stock movements are created automatically)

  2. Security
    - Anon can only INSERT (create stock movements)
    - Cannot view or modify existing stock
    - Admin still has full access
*/

-- Allow anonymous users to create stock movements (for orders)
CREATE POLICY "Anon can create stock movements"
  ON stock FOR INSERT
  TO anon
  WITH CHECK (true);
