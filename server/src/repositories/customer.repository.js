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
        RETURNING id, name, email, phone, address, city, state, pincode, created_at, updated_at, is_registered
        `,
        [name, email || null, phone, address, city, state, pincode]
    );
    return result.rows[0];
};

const getCustomerById = async (id, client = pool) => {
    const result = await client.query(`
        SELECT 
            c.id, c.name, c.email, c.phone, c.address, c.city, c.state, c.pincode, c.created_at, c.updated_at, c.is_registered,
            COUNT(o.id) as total_orders,
            COALESCE(SUM(o.total_amount), 0) as total_spent,
            MAX(o.created_at) as latest_order_date
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        WHERE c.id = $1
        GROUP BY c.id
    `, [id]);
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
        RETURNING id, name, email, phone, address, city, state, pincode, created_at, updated_at, is_registered
        `,
        [name, email || null, phone, address, city, state, pincode, id]
    );
    return result.rows[0];
};


const getCustomers = async (search, isRegistered, limit, offset, client = pool) => {
    let query = `
        SELECT 
            c.id, c.name, c.email, c.phone, c.address, c.city, c.state, c.pincode, c.created_at, c.updated_at, c.is_registered,
            COUNT(o.id) as total_orders,
            COALESCE(SUM(o.total_amount), 0) as total_spent,
            MAX(o.created_at) as latest_order_date
        FROM customers c
        LEFT JOIN orders o ON c.id = o.customer_id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
        query += " AND (c.name ILIKE $" + paramIndex + " OR c.email ILIKE $" + paramIndex + " OR c.phone ILIKE $" + paramIndex + ")";
        params.push("%" + search + "%");
        paramIndex++;
    }

    if (isRegistered !== undefined && isRegistered !== null) {
        query += " AND c.is_registered = $" + paramIndex;
        params.push(isRegistered);
        paramIndex++;
    }

    query += " GROUP BY c.id ORDER BY c.created_at DESC LIMIT $" + paramIndex + " OFFSET $" + (paramIndex + 1);
    params.push(limit, offset);

    const result = await client.query(query, params);
    return result.rows;
};

const countCustomers = async (search, isRegistered, client = pool) => {
    let query = "SELECT COUNT(id) as total FROM customers WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (search) {
        query += " AND (name ILIKE $" + paramIndex + " OR email ILIKE $" + paramIndex + " OR phone ILIKE $" + paramIndex + ")";
        params.push("%" + search + "%");
        paramIndex++;
    }

    if (isRegistered !== undefined && isRegistered !== null) {
        query += " AND is_registered = $" + paramIndex;
        params.push(isRegistered);
        paramIndex++;
    }

    const result = await client.query(query, params);
    return parseInt(result.rows[0].total, 10);
};



const findCustomerByEmail = async (email, client = pool) => {
    const result = await client.query("SELECT * FROM customers WHERE email = $1", [email]);
    return result.rows[0];
};

const registerCustomer = async (name, email, phone, passwordHash, client = pool) => {
    const result = await client.query(
        `
        INSERT INTO customers
        (name, email, phone, password_hash, is_registered)
        VALUES ($1, $2, $3, $4, TRUE)
        ON CONFLICT (email) DO UPDATE
        SET 
            name = EXCLUDED.name,
            phone = EXCLUDED.phone,
            password_hash = EXCLUDED.password_hash,
            is_registered = TRUE,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, name, email, phone, address, city, state, pincode, created_at, updated_at, is_registered
        `,
        [name, email, phone, passwordHash]
    );
    return result.rows[0];
};

module.exports = {
    findCustomerByEmail,
    registerCustomer,
    createCustomer,
    getCustomerById,
    updateCustomer,
    getCustomers,
    countCustomers
};
