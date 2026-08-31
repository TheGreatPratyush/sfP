const pool = require("../config/database");

const createCustomer = async (name, email, phone, address, city, state, pincode, client = pool) => {
    const result = await client.query(
        `
        INSERT INTO customers
        (name, email, phone, address, city, state, pincode)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO UPDATE
        SET 
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            address = EXCLUDED.address,
            city = EXCLUDED.city,
            state = EXCLUDED.state,
            pincode = EXCLUDED.pincode,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *
        `,
        [name, email || null, phone, address, city, state, pincode]
    );
    return result.rows[0];
};

const getCustomerById = async (id, client = pool) => {
    const result = await client.query("SELECT * FROM customers WHERE id = $1", [id]);
    return result.rows[0];
};

const updateCustomer = async (id, name, email, phone, address, city, state, pincode, client = pool) => {
    const result = await client.query(
        `
        UPDATE customers
        SET
            name = $1,
            email = $2,
            phone = $3,
            address = $4,
            city = $5,
            state = $6,
            pincode = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
        `,
        [name, email || null, phone, address, city, state, pincode, id]
    );
    return result.rows[0];
};

const getCustomers = async (search, limit, offset, client = pool) => {
    let query = "SELECT * FROM customers WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await client.query(query, params);
    return result.rows;
};

const countCustomers = async (search, client = pool) => {
    let query = "SELECT COUNT(id) as total FROM customers WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    const result = await client.query(query, params);
    return parseInt(result.rows[0].total, 10);
};

module.exports = {
    createCustomer,
    getCustomerById,
    updateCustomer,
    getCustomers,
    countCustomers
};
