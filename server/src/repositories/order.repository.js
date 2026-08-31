const pool = require("../config/database");

const createOrder = async (
    customerId,
    totalAmount,
    deliveryAddress,
    deliveryCity,
    deliveryState,
    deliveryPincode,
    client = pool
) => {
    const result = await client.query(
        `
        INSERT INTO orders
        (customer_id, status, total_amount, delivery_address, delivery_city, delivery_state, delivery_pincode)
        VALUES ($1, 'pending', $2, $3, $4, $5, $6)
        RETURNING *
        `,
        [customerId, totalAmount, deliveryAddress, deliveryCity, deliveryState, deliveryPincode]
    );
    return result.rows[0];
};

const createOrderItem = async (
    orderId,
    variantId,
    productName,
    variantSku,
    variantSize,
    variantColor,
    quantity,
    priceAtPurchase,
    client = pool
) => {
    const result = await client.query(
        `
        INSERT INTO order_items
        (order_id, variant_id, product_name, variant_sku, variant_size, variant_color, quantity, price_at_purchase)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [orderId, variantId, productName, variantSku, variantSize, variantColor, quantity, priceAtPurchase]
    );
    return result.rows[0];
};

const getOrderById = async (id, client = pool) => {
    const result = await client.query(
        `
        SELECT
            o.*,
            c.name as customer_name,
            c.email as customer_email,
            c.phone as customer_phone
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.id = $1
        `,
        [id]
    );
    return result.rows[0];
};

const getOrderItems = async (orderId, client = pool) => {
    const result = await client.query(
        "SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC",
        [orderId]
    );
    return result.rows;
};

const getOrders = async (search, status, sortBy, sortOrder, limit, offset, client = pool) => {
    let query = `
        SELECT
            o.id,
            o.status,
            o.total_amount,
            o.created_at,
            c.name as customer_name,
            c.phone as customer_phone
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
        // Check if search is a number (for order ID)
        const isNumeric = !isNaN(Number(search));
        
        query += ` AND (`;
        if (isNumeric) {
            query += `o.id = $${paramIndex} OR `;
            params.push(Number(search));
            paramIndex++;
        }
        
        query += `c.name ILIKE $${paramIndex} OR c.phone ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        query += ` AND o.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }

    // Safely apply sorting
    const allowedSortFields = {
        id: 'o.id',
        created_at: 'o.created_at',
        total_amount: 'o.total_amount',
        status: 'o.status'
    };
    
    const sortField = allowedSortFields[sortBy] || 'o.created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortDirection}`;
    
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await client.query(query, params);
    return result.rows;
};

const countOrders = async (search, status, client = pool) => {
    let query = `
        SELECT COUNT(o.id) as total
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
        const isNumeric = !isNaN(Number(search));
        query += ` AND (`;
        if (isNumeric) {
            query += `o.id = $${paramIndex} OR `;
            params.push(Number(search));
            paramIndex++;
        }
        query += `c.name ILIKE $${paramIndex} OR c.phone ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        query += ` AND o.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }

    const result = await client.query(query, params);
    return parseInt(result.rows[0].total, 10);
};

const updateOrderStatus = async (id, status, client = pool) => {
    const result = await client.query(
        `
        UPDATE orders
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
    );
    return result.rows[0];
};

const getOrdersByCustomerId = async (customerId, limit, offset, client = pool) => {
    const result = await client.query(
        `
        SELECT id, created_at, status, total_amount
        FROM orders
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [customerId, limit, offset]
    );
    return result.rows;
};

const countOrdersByCustomerId = async (customerId, client = pool) => {
    const result = await client.query(
        "SELECT COUNT(id) as total FROM orders WHERE customer_id = $1",
        [customerId]
    );
    return parseInt(result.rows[0].total, 10);
};

module.exports = {
    createOrder,
    createOrderItem,
    getOrderById,
    getOrderItems,
    getOrders,
    countOrders,
    updateOrderStatus,
    getOrdersByCustomerId,
    countOrdersByCustomerId
};
