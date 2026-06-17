import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { logger } from '../utils/logger';

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8888';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  useEffect(() => {
    if (!socketRef.current && !isInitialized) {
      const socket = io(WS_URL, {
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true,
        transports: ['websocket', 'polling']
      });

      socket.on('connect_error', (error) => {
        logger.error('Socket connection error', error);
        reconnectAttemptsRef.current++;

        if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
          logger.warn('Max reconnection attempts reached, stopping reconnection');
          socket.disconnect();
        }
      });

      socket.on('connect', () => {
        reconnectAttemptsRef.current = 0;
      });

      socket.on('disconnect', (reason) => {
        // 'io server disconnect' means server explicitly disconnected the client
        // Don't auto-reconnect in this case, let the user refresh or trigger manually
        if (reason === 'io server disconnect') {
          logger.warn('Server disconnected the WebSocket, not reconnecting automatically');
          // Don't call socket.connect() - this prevents infinite reconnection loop
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
      reconnectAttemptsRef.current = 0;
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
