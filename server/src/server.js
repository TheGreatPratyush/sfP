const http = require("http");

const app = require("./app");
const env = require("./config/env");
const initializeSocket = require("./sockets/socket");

const {
    registerInventorySocket,
} = require("./sockets/inventory.socket");

// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Register inventory-related socket events
registerInventorySocket(io);

// Make Socket.IO available to Express controllers
app.set("io", io);

// Starts the HTTP + Socket.IO server
server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
});