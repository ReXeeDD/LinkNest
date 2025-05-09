# P2P File and Text Sharing

This is a peer-to-peer (P2P) file and text sharing web application that allows users to create and join rooms to share files and text messages securely. The app uses WebSockets (via Socket.io) for real-time communication between clients and a Node.js backend.

With this app, you can share files from your device to any other device in the same room, without any risky or complicated connections. The peer-to-peer architecture ensures that the file-sharing process is secure and private, without relying on a central server to store your data. 

This means you can easily exchange files and messages between devices directly, providing a seamless and secure sharing experience.

## Features
- **Create Room**: Generate a unique room ID and share it with others to join the room.
- **Join Room**: Users can join a room using the room ID.
- **Peer-to-Peer Communication**: Once connected, users can exchange messages, signals, and files via WebSockets in real time.
- **Room Management**: Rooms are dynamically created and removed when no users remain.
- **Secure File Sharing**: Share files securely between devices without involving any centralized server, ensuring privacy and direct communication between peers.


## Prerequisites

Before you start, you need to have the following installed on your system:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- A modern browser (Chrome, Firefox, etc.)

## Running A SERVER:
1. **Cloud Deployment Section**: Added instructions for deploying the app using platforms like Render, which makes the application accessible online and from any device.
2. **Steps for Cloud Deployment**: Detailed steps to push to GitHub, set up a web service on Render, and deploy the app online, making it accessible globally.

Let me know if you need further modifications!

**Start the Server Locally**

   To start the server on your local machine, use PM2, a process manager for Node.js applications:

   ```bash
   pm2 start server.js
   pm2 stop server





