import React, { createContext, useContext, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const socketRef = useRef<Socket | null>(null);
  if (!socketRef.current) {
    socketRef.current = io('http://localhost:8888');
  }
  useEffect(() => {
    console.log('connecting socket');
    return () => {
      console.log('Disconnecting socket');
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
