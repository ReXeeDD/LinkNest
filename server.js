const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

let activeRooms = new Set();

function generateRoomId() {
  let roomId;
  do {
    roomId = crypto.randomBytes(4).toString('hex').slice(0, 8);
  } while (activeRooms.has(roomId));
  activeRooms.add(roomId);
  return roomId;
}

io.on('connection', socket => {
  let currentRoom = null;

  socket.on('join-room', roomId => {
    roomId = roomId.toLowerCase();
    if (!/^[a-f0-9]{8}$/.test(roomId)) {
      socket.emit('invalid-room');
      return;
    }

    currentRoom = roomId;
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);

    socket.on('signal', data => {
      io.to(data.to).emit('signal', {
        from: socket.id,
        signal: data.signal
      });
    });

    socket.on('disconnect', () => {
      if (currentRoom) {
        socket.to(currentRoom).emit('user-left', socket.id);
        if (io.sockets.adapter.rooms.get(currentRoom)?.size === 0) {
          activeRooms.delete(currentRoom);
        }
      }
    });
  });
});

app.get('/create-room', (req, res) => {
  const roomId = generateRoomId();
  res.redirect(`/room.html?room=${roomId}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/room.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));