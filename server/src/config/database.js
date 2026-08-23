// Import PostgreSQL connection pool
const { Pool } = require("pg");

// Load application configuration
const env = require("./env");

// Create PostgreSQL connection pool
const pool = new Pool({
    user: env.dbUser,
    host: env.dbHost,
    database: env.dbName,
    password: env.dbPassword,
    port: env.dbPort,
});

// Export the database connection
module.exports = pool;