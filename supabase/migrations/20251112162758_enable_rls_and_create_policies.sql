/*
  # Enable RLS and Create Security Policies

  1. Security Configuration
    - Enable RLS on all tables that need it
    - Create policies for anonymous users (public read-only)
    - Create policies for authenticated admin users (full access)

  2. Tables with Policies
    - categories: Public read, Admin full access
    - sub_categories: Public read, Admin full access
    - products: Public read, Admin full access
    - stock: Admin only
    - orders: Anon insert, Admin full access
    - order_items: Anon insert, Admin full access
    - sales: Admin only
    - payment_methods: Public read, Admin full access
    - faq: Public read (active only), Admin full access
    - users: Admin only
    - user_roles: Public read, Admin full access

  3. Security Notes
    - Anonymous users can browse products and create orders
    - Only authenticated admin users can manage all data
    - Admin users are identified by role in users table
*/

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Sub Categories Policies
CREATE POLICY "Public can view sub_categories"
  ON sub_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage sub_categories"
  ON sub_categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Products Policies
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Stock Policies (Admin only)
CREATE POLICY "Admin can view stock"
  ON stock FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can manage stock"
  ON stock FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Orders Policies
CREATE POLICY "Anon can create orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Order Items Policies
CREATE POLICY "Anon can create order_items"
  ON order_items FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admin can view all order_items"
  ON order_items FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can manage order_items"
  ON order_items FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Sales Policies (Admin only)
CREATE POLICY "Admin can view sales"
  ON sales FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can manage sales"
  ON sales FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Payment Methods Policies
CREATE POLICY "Public can view active payment_methods"
  ON payment_methods FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admin can manage payment_methods"
  ON payment_methods FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- FAQ Policies
CREATE POLICY "Public can view active FAQs"
  ON faq FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admin can manage FAQs"
  ON faq FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Users Policies (Admin only)
CREATE POLICY "Admin can view users"
  ON users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can manage users"
  ON users FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- User Roles Policies
CREATE POLICY "Public can view user_roles"
  ON user_roles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage user_roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
