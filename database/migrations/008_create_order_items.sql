-- Creates the order_items table for storing items within an order.

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id INTEGER NOT NULL REFERENCES product_variants(id),
    product_name VARCHAR(255) NOT NULL,
    variant_sku VARCHAR(100),
    variant_size VARCHAR(20),
    variant_color VARCHAR(50),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
