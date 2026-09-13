const pool = require("../config/database");

// Get all products
const getAllProducts = async () => {
    const result = await pool.query(`
        SELECT 
            p.*,
            c.name AS category_name,
            COALESCE(
                (SELECT json_agg(pi ORDER BY pi.display_order ASC, pi.id ASC)
                 FROM product_images pi WHERE pi.product_id = p.id),
                '[]'
            ) AS images,
            COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'id', pv.id,
                        'size', pv.size,
                        'color', pv.color,
                        'sku', pv.sku,
                        'price', pv.price,
                        'stock', COALESCE(i.quantity, 0)
                    ) ORDER BY pv.id ASC
                )
                 FROM product_variants pv 
                 LEFT JOIN inventory i ON i.variant_id = pv.id
                 WHERE pv.product_id = p.id),
                '[]'
            ) AS variants
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
                (SELECT json_agg(pi ORDER BY pi.display_order ASC, pi.id ASC)
                 FROM product_images pi WHERE pi.product_id = p.id),
                '[]'
            ) AS images,
            COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'id', pv.id,
                        'size', pv.size,
                        'color', pv.color,
                        'sku', pv.sku,
                        'price', pv.price,
                        'stock', COALESCE(i.quantity, 0)
                    ) ORDER BY pv.id ASC
                )
                 FROM product_variants pv 
                 LEFT JOIN inventory i ON i.variant_id = pv.id
                 WHERE pv.product_id = p.id),
                '[]'
            ) AS variants
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
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

// Deletes a product image record
const deleteProductImage = async (
    productId,
    imageId
) => {
    const result = await pool.query(
        `
        DELETE FROM product_images
        WHERE id = $1
        AND product_id = $2
        RETURNING *
        `,
        [imageId, productId]
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
    deleteProductImage,
};
