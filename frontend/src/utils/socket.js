import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected to socket server:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export default socket;
