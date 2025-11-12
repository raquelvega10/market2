/*
  # Add 'vendido' status to orders table

  1. Changes
    - Drop existing status check constraint
    - Add new constraint including 'vendido' status
  
  2. Notes
    - This allows orders to be marked as 'vendido' (sold)
    - When an order is marked as 'vendido', a sale record is automatically created
*/

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY['pendiente'::text, 'confirmada'::text, 'enviada'::text, 'cancelada'::text, 'completada'::text, 'vendido'::text]));
