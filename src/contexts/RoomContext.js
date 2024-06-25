import React, { createContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomError, setRoomError] = useState(null);

  const { on, off, emit, socket } = useSocket();

  useEffect(() => {
    console.log('RoomProvider mounted');
    return () => {
      console.log('RoomProvider unmounted');
    }
  }, []);

  useEffect(() => {
    const storedRoomId = localStorage.getItem('roomId');
    if (!storedRoomId) {
      return
    }
    if (!socket) {
      return
    }

    emit('joinRoom', storedRoomId);
    console.log('Joining room', storedRoomId);
  });

  useEffect(() => {
    if (!socket) {
      return;
    }
    on('roomCreated', (id) => {
      setRoomId(id);
      setRoomCreated(true);
      setRoomJoined(true);
      localStorage.setItem('roomId', id);
    });

    on('roomJoined', (id) => {
      setRoomId(id);
      setRoomJoined(true);
      localStorage.setItem('roomId', id);
    });

    on('roomLeft', () => {
      setRoomId(null);
      setRoomJoined(false);
      localStorage.removeItem('roomId');
    });

    on('roomError', (message) => {
      console.error(message);
      setRoomError(message);
      setRoomId(null);
      setRoomJoined(false);
      localStorage.removeItem('roomId');
    });

    return () => {
      off('roomJoined');
      off('roomCreated');
      off('roomLeft');
      off('roomError');
    };
  }, [off, on, setRoomCreated, setRoomError, setRoomId, setRoomJoined, socket]);

  return (
    <RoomContext.Provider value={{
      roomId,
      roomJoined,
      roomCreated,
      roomError,
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export { RoomContext, RoomProvider };
