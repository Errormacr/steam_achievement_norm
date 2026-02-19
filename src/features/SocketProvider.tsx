import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { logger } from '../utils/logger';

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!socketRef.current && !isInitialized) {
      const socket = io('http://localhost:8888', {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        transports: ['websocket', 'polling']
      });

      socket.on('connect_error', (error) => {
        logger.error('Socket connection error', error);
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      socket.on('error', (error) => {
        logger.error('Socket error', error);
      });

      socketRef.current = socket;
      setIsInitialized(true);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
