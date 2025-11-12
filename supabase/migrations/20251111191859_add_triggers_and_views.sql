/*
  # Add Triggers and Views for Cuba Marketplace

  ## Overview
  This migration adds the missing triggers and views for the marketplace system.

  ## 1. Triggers

  ### calculate_stock_balance
  - Automatically calculates saldo_inicial and saldo_final for stock movements
  - saldo_inicial = last saldo_final for the product
  - saldo_final = saldo_inicial + quantity (entrada) or - quantity (salida)

  ### update_timestamp triggers
  - Updates updated_at timestamp on products, orders, and stock tables

  ## 2. Views

  ### stock_productos
  - Shows current stock for each product (last saldo_final)

  ## Important Notes
  - Stock balance is calculated automatically on INSERT
  - Timestamps are updated automatically on UPDATE
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS stock_productos;

-- Create stock_productos view
CREATE OR REPLACE VIEW stock_productos AS
SELECT DISTINCT ON (product_name)
  product_name,
  saldo_final as stock_actual,
  created_at as last_updated
FROM stock
ORDER BY product_name, created_at DESC;

-- Trigger function to calculate stock balance
CREATE OR REPLACE FUNCTION calculate_stock_balance()
RETURNS TRIGGER AS $$
DECLARE
  ultimo_saldo numeric;
BEGIN
  -- Get last saldo_final for this product
  SELECT COALESCE(saldo_final, 0) INTO ultimo_saldo
  FROM stock
  WHERE product_name = NEW.product_name
  ORDER BY created_at DESC
  LIMIT 1;

  -- Set saldo_inicial
  NEW.saldo_inicial := ultimo_saldo;

  -- Calculate saldo_final based on movement type
  IF NEW.movement_type = 'entrada' THEN
    NEW.saldo_final := NEW.saldo_inicial + NEW.quantity;
  ELSIF NEW.movement_type = 'salida' THEN
    NEW.saldo_final := NEW.saldo_inicial - NEW.quantity;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock balance calculation
DROP TRIGGER IF EXISTS trigger_calculate_stock_balance ON stock;
CREATE TRIGGER trigger_calculate_stock_balance
  BEFORE INSERT ON stock
  FOR EACH ROW
  EXECUTE FUNCTION calculate_stock_balance();

-- Trigger function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trigger_update_products_timestamp ON products;
CREATE TRIGGER trigger_update_products_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_orders_timestamp ON orders;
CREATE TRIGGER trigger_update_orders_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();