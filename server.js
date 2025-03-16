const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-app-name.onrender.com' 
      : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (username) => {
    users.set(socket.id, username);
    io.emit('userJoined', {
      user: username,
      users: Array.from(users.values())
    });
  });

  socket.on('message', (message) => {
    const username = users.get(socket.id);
    io.emit('message', {
      text: message,
      user: username,
      id: Date.now()
    });
  });

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('userLeft', {
      user: username,
      users: Array.from(users.values())
    });
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 