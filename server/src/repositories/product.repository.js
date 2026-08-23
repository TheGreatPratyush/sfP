const pool = require("../config/database");

// Get all products
const getAllProducts = async () => {
    const result = await pool.query(`
        SELECT 
            p.*,
            c.name AS category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        ORDER BY p.id ASC
    `);

    return result.rows;
};

// Get one product by ID
const getProductById = async (id) => {
    const result = await pool.query(
        `
        SELECT 
            p.*,
            c.name AS category_name,
            COALESCE(
                json_agg(
                    pi
                    ORDER BY pi.display_order ASC, pi.id ASC
                ) FILTER (WHERE pi.id IS NOT NULL),
                '[]'
            ) AS images
        FROM products p
        JOIN categories c 
            ON p.category_id = c.id
        LEFT JOIN product_images pi
            ON pi.product_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, c.name
        `,
        [id]
    );

    return result.rows[0];
};

// Create a product
const createProduct = async (
    name,
    description,
    categoryId,
    price,
    discountPercentage,
    status
) => {
    const result = await pool.query(
        `
        INSERT INTO products
        (name, description, category_id, price, discount_percentage, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [
            name,
            description,
            categoryId,
            price,
            discountPercentage,
            status,
        ]
    );

    return result.rows[0];
};

// Update a product
const updateProduct = async (
    id,
    name,
    description,
    categoryId,
    price,
    discountPercentage,
    status
) => {
    const result = await pool.query(
        `
        UPDATE products
        SET
            name = $1,
            description = $2,
            category_id = $3,
            price = $4,
            discount_percentage = $5,
            status = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *
        `,
        [
            name,
            description,
            categoryId,
            price,
            discountPercentage,
            status,
            id,
        ]
    );

    return result.rows[0];
};

// Delete a product
const deleteProduct = async (id) => {
    const result = await pool.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
};

// Saves a product image record
const createProductImage = async (
    productId,
    imageUrl,
    displayOrder = 0,
    isPrimary = false
) => {
    const result = await pool.query(
        `
        INSERT INTO product_images
        (product_id, image_url, display_order, is_primary)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [productId, imageUrl, displayOrder, isPrimary]
    );

    return result.rows[0];
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductImage,
};