const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any origin
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Set to keep track of active rooms
let activeRooms = new Set();

// Function to generate unique room ID (8 hex characters)
function generateRoomId() {
  let roomId;
  do {
    roomId = crypto.randomBytes(4).toString('hex').slice(0, 8); // Generate 8-character hex ID
  } while (activeRooms.has(roomId)); // Ensure the room ID is unique
  activeRooms.add(roomId); // Add the room ID to the active rooms set
  return roomId;
}

// Handle new socket connections
io.on('connection', socket => {
  let currentRoom = null; // Track the current room the socket is in

  // When a user joins a room
  socket.on('join-room', roomId => {
    roomId = roomId.toLowerCase(); // Normalize roomId to lowercase
    // Validate room ID format (8 hexadecimal characters)
    if (!/^[a-f0-9]{8}$/.test(roomId)) {
      socket.emit('invalid-room'); // Emit invalid-room event if the ID is invalid
      return;
    }

    currentRoom = roomId;
    socket.join(roomId); // Join the room
    socket.to(roomId).emit('user-joined', socket.id); // Notify others in the room

    // Handle signaling between peers
    socket.on('signal', data => {
      io.to(data.to).emit('signal', {
        from: socket.id,
        signal: data.signal,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (currentRoom) {
        socket.to(currentRoom).emit('user-left', socket.id); // Notify others when a user leaves
        // Clean up the room if there are no more users
        if (io.sockets.adapter.rooms.get(currentRoom)?.size === 0) {
          activeRooms.delete(currentRoom);
        }
      }
    });
  });
});

// Endpoint to create a new room
app.get('/create-room', (req, res) => {
  const roomId = generateRoomId(); // Generate a new room ID
  res.redirect(`/room.html?room=${roomId}`); // Redirect to room page with the new room ID
});

// Default route to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the index.html file
});

// Route to serve the room page
app.get('/room.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html')); // Serve the room.html file
});

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000; // Use the environment variable PORT or default to 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the server start message
});
