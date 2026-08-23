// // Load environment variables

// require("dotenv").config({ path: "../.env" });

// // Export application configuration

// module.exports = {
//     port: process.env.PORT || 5001,

//     dbUser: process.env.DB_USER,

//     dbHost: process.env.DB_HOST,

//     dbName: process.env.DB_NAME,

//     dbPassword: process.env.DB_PASSWORD,

//     dbPort: process.env.DB_PORT || 5432,
// };
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

module.exports = {
    port: process.env.PORT || 5001,
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPassword: process.env.DB_PASSWORD,
    dbPort: process.env.DB_PORT || 5432,
};