// Register inventory-related Socket.IO events

const INVENTORY_UPDATED_EVENT = "inventory:updated";

const registerInventorySocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Handles client disconnection
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

// Broadcast inventory changes to connected clients
const emitInventoryUpdate = (io, action, inventory) => {
    io.emit(INVENTORY_UPDATED_EVENT, {
        action,
        inventory,
    });
};

module.exports = {
    registerInventorySocket,
    emitInventoryUpdate,
};