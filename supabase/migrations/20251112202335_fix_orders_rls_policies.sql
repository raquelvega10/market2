/*
  # Fix Orders RLS Policies

  1. Changes
    - Drop all existing policies on orders, order_items, and stock
    - Recreate policies with correct separation
    - Ensure anon can INSERT without conflicts

  2. Security
    - Anonymous users: Can INSERT orders, order_items, and stock movements
    - Anonymous users: Can SELECT stock (for availability)
    - Authenticated admins: Full access to everything
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Admin can manage orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Anon can create orders" ON orders;

DROP POLICY IF EXISTS "Admin can manage order_items" ON order_items;
DROP POLICY IF EXISTS "Admin can view all order_items" ON order_items;
DROP POLICY IF EXISTS "Anon can create order_items" ON order_items;

DROP POLICY IF EXISTS "Admin can manage stock" ON stock;
DROP POLICY IF EXISTS "Admin can view stock" ON stock;
DROP POLICY IF EXISTS "Anon can create stock movements" ON stock;
DROP POLICY IF EXISTS "Anon can view stock" ON stock;

-- Orders Policies
CREATE POLICY "Anon can insert orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can select orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (is_admin());

-- Order Items Policies
CREATE POLICY "Anon can insert order_items"
  ON order_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can select order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can update order_items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete order_items"
  ON order_items FOR DELETE
  TO authenticated
  USING (is_admin());

-- Stock Policies
CREATE POLICY "Anon can insert stock"
  ON stock FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can select stock"
  ON stock FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can update stock"
  ON stock FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete stock"
  ON stock FOR DELETE
  TO authenticated
  USING (is_admin());
