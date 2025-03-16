import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import { Message, UserEvent } from './types';

const SOCKET_SERVER = process.env.NODE_ENV === 'production'
  ? 'https://your-app-name.onrender.com'
  : 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('userJoined', ({ users }: UserEvent) => {
      setUsers(users);
    });

    socket.on('userLeft', ({ users }: UserEvent) => {
      setUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !socket) return;
    
    socket.emit('join', username);
    setIsJoined(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit('message', message);
    setMessage('');
  };

  if (!isJoined) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Join Chat
          </Typography>
          <Box component="form" onSubmit={handleJoin} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Join
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={9}>
          <Paper
            sx={{
              height: 'calc(100vh - 200px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <List>
                {messages.map((msg) => (
                  <ListItem key={msg.id}>
                    <ListItemText
                      primary={msg.text}
                      secondary={msg.user}
                      sx={{
                        '& .MuiListItemText-primary': {
                          backgroundColor: msg.user === username ? '#e3f2fd' : '#f5f5f5',
                          padding: 1,
                          borderRadius: 1,
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <div ref={messagesEndRef} />
            </Box>
            <Divider />
            <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ height: '100%' }}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
            <Typography variant="h6" gutterBottom>
              Online Users ({users.length})
            </Typography>
            <List>
              {users.map((user) => (
                <ListItem key={user}>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App; 