const pool = require("../config/database");

// Get dashboard summary statistics
const getSummary = async () => {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM products) AS total_products,
            (SELECT COUNT(*) FROM product_variants) AS total_variants,
            (SELECT COUNT(*) FROM categories) AS total_categories,
            COALESCE(
                (SELECT SUM(quantity) FROM inventory),
                0
            ) AS total_stock
    `);

    return result.rows[0];
};

// Get inventory overview
const getInventoryOverview = async () => {
    const result = await pool.query(`
        SELECT
            COUNT(*) FILTER (
                WHERE quantity > 0
                AND quantity <= low_stock_threshold
            ) AS low_stock,

            COUNT(*) FILTER (
                WHERE quantity = 0
            ) AS out_of_stock

        FROM inventory
    `);

    return result.rows[0];
};

// Get products that are low on stock
const getLowStockProducts = async () => {
    const result = await pool.query(`
        SELECT
            i.id AS inventory_id,
            i.quantity,
            i.low_stock_threshold,

            pv.id AS variant_id,
            pv.size,
            pv.color,
            pv.sku,

            p.id AS product_id,
            p.name AS product_name

        FROM inventory i

        JOIN product_variants pv
            ON i.variant_id = pv.id

        JOIN products p
            ON pv.product_id = p.id

        WHERE i.quantity <= i.low_stock_threshold

        ORDER BY i.quantity ASC
    `);

    return result.rows;
};

// Get number of products in each category
const getCategoryDistribution = async () => {
    const result = await pool.query(`
        SELECT
            c.id,
            c.name,
            COUNT(p.id) AS product_count

        FROM categories c

        LEFT JOIN products p
            ON p.category_id = c.id

        GROUP BY c.id, c.name

        ORDER BY product_count DESC
    `);

    return result.rows;
};

// Get recently added products
const getRecentProducts = async () => {
    const result = await pool.query(`
        SELECT
            p.id,
            p.name,
            p.price,
            p.status,
            p.created_at,
            c.name AS category_name

        FROM products p

        JOIN categories c
            ON p.category_id = c.id

        ORDER BY p.created_at DESC

        LIMIT 5
    `);

    return result.rows;
};

module.exports = {
    getSummary,
    getInventoryOverview,
    getLowStockProducts,
    getCategoryDistribution,
    getRecentProducts,
};