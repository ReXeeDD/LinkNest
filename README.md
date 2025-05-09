# P2P File and Text Sharing

This is a peer-to-peer (P2P) file and text sharing web application that allows users to create and join rooms to share files and text messages securely. The app uses WebSockets (via Socket.io) for real-time communication between clients and a Node.js backend.

## Features
- **Create Room**: Generate a unique room ID and share it with others to join the room.
- **Join Room**: Users can join a room using the room ID.
- **Peer-to-Peer Communication**: Once connected, users can exchange messages and signals via WebSockets.
- **Room Management**: Rooms are dynamically created and removed when no users remain.

## Prerequisites

Before you start, you need to have the following installed on your system:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- A modern browser (Chrome, Firefox, etc.)

**Start the Server Locally**

   To start the server on your local machine, use PM2, a process manager for Node.js applications:

   ```bash
   pm2 start server.js
   pm2 stop server 
