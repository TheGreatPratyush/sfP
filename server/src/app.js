const express = require("express");
const cors = require("cors");
const path = require("path");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const variantRoutes = require("./routes/variant.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Configures application middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves uploaded product images
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

// Registers API routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Handles undefined routes and application errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;