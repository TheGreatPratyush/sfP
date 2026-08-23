const pool = require("../config/database");

// Get all inventory records
const getAllInventory = async () => {
    const result = await pool.query(`
        SELECT
            i.*,
            pv.product_id,
            pv.size,
            pv.color,
            pv.sku,
            p.name AS product_name
        FROM inventory i
        JOIN product_variants pv ON i.variant_id = pv.id
        JOIN products p ON pv.product_id = p.id
        ORDER BY i.id ASC
    `);

    return result.rows;
};

// Get inventory by variant ID
const getInventoryByVariantId = async (variantId) => {
    const result = await pool.query(
        "SELECT * FROM inventory WHERE variant_id = $1",
        [variantId]
    );

    return result.rows[0];
};

// Create inventory record
const createInventory = async (
    variantId,
    quantity,
    lowStockThreshold
) => {
    const result = await pool.query(
        `
        INSERT INTO inventory
        (variant_id, quantity, low_stock_threshold)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [variantId, quantity, lowStockThreshold]
    );

    return result.rows[0];
};

// Update inventory quantity
const updateInventoryQuantity = async (
    variantId,
    quantity,
    lowStockThreshold
) => {
    const result = await pool.query(
        `
        UPDATE inventory
        SET
            quantity = $1,
            low_stock_threshold = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE variant_id = $3
        RETURNING *
        `,
        [quantity, lowStockThreshold, variantId]
    );

    return result.rows[0];
};

// Delete inventory record
const deleteInventory = async (variantId) => {
    const result = await pool.query(
        "DELETE FROM inventory WHERE variant_id = $1 RETURNING *",
        [variantId]
    );

    return result.rows[0];
};

module.exports = {
    getAllInventory,
    getInventoryByVariantId,
    createInventory,
    updateInventoryQuantity,
    deleteInventory,
};