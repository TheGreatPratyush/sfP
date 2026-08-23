const pool = require("../config/database");

// Get all variants
const getAllVariants = async () => {
    const result = await pool.query(`
        SELECT
            pv.*,
            p.name AS product_name
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        ORDER BY pv.id ASC
    `);

    return result.rows;
};

// Get variants for one product
const getVariantsByProductId = async (productId) => {
    const result = await pool.query(`
        SELECT *
        FROM product_variants
        WHERE product_id = $1
        ORDER BY id ASC
    `, [productId]);

    return result.rows;
};

// Get one variant
const getVariantById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM product_variants WHERE id = $1",
        [id]
    );

    return result.rows[0];
};

// Create a variant
const createVariant = async (
    productId,
    size,
    color,
    sku,
    price
) => {
    const result = await pool.query(`
        INSERT INTO product_variants
        (product_id, size, color, sku, price)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [
        productId,
        size,
        color,
        sku,
        price
    ]);

    return result.rows[0];
};

// Update a variant
const updateVariant = async (
    id,
    size,
    color,
    sku,
    price
) => {
    const result = await pool.query(`
        UPDATE product_variants
        SET
            size = $1,
            color = $2,
            sku = $3,
            price = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
    `, [
        size,
        color,
        sku,
        price,
        id
    ]);

    return result.rows[0];
};

// Delete a variant
const deleteVariant = async (id) => {
    const result = await pool.query(
        "DELETE FROM product_variants WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};

module.exports = {
    getAllVariants,
    getVariantsByProductId,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant,
};