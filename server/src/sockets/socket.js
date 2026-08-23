const { Server } = require("socket.io");

// Initialize Socket.IO
const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    return io;
};

module.exports = initializeSocket;