// Import PostgreSQL connection pool
const { Pool } = require("pg");

// Load application configuration
const env = require("./env");

let poolConfig = {};

if (process.env.DATABASE_URL) {
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };
} else {
    poolConfig = {
        user: env.dbUser,
        host: env.dbHost,
        database: env.dbName,
        password: env.dbPassword,
        port: env.dbPort,
    };
}

// Create PostgreSQL connection pool
const pool = new Pool(poolConfig);

// Export the database connection
module.exports = pool;
