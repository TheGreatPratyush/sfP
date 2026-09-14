const express = require("express");
const cors = require("cors");
const path = require("path");

const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const variantRoutes = require("./routes/variant.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const customerRoutes = require("./routes/customer.routes");
const orderRoutes = require("./routes/order.routes");
const authRoutes = require("./routes/auth.routes");
const customerAuthRoutes = require("./routes/customerAuth.routes");
const customerOrderRoutes = require("./routes/customerOrder.routes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Configures application middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
};
app.use(cors(corsOptions));
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
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customer-auth", customerAuthRoutes);
app.use("/api/customer/orders", customerOrderRoutes);

// Handles undefined routes and application errors
app.use(notFound);
app.use(errorHandler);

module.exports = app;
