const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the frontend files from a folder named "public"
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for incoming location data from a client
    socket.on('send-location', (data) => {
        // Broadcast that location data to every OTHER connected user
        socket.broadcast.emit('receive-location', {
            id: socket.id,
            ...data
        });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('user-disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});