-- Add account fields to customers table
ALTER TABLE customers
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN is_registered BOOLEAN DEFAULT FALSE;
