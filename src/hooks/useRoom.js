import { useContext } from 'react';
import { RoomContext } from '../contexts/RoomContext';
import useSocket from './useSocket';

const useRoom = () => {
  const { roomId,
    roomJoined,
    roomLeft,
    roomCreated,
    roomError
  } = useContext(RoomContext);

  const { emit } = useSocket();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 9);
    emit('createRoom', newRoomId);
  };

  const joinRoom = (id) => {
    emit('joinRoom', id);
  };

  const leaveRoom = () => {
    emit('leaveRoom', roomId);
  };

  return {
    roomId,
    roomCreated,
    roomJoined,
    roomLeft,
    roomError,
    createRoom,
    joinRoom,
    leaveRoom
  };
};

export default useRoom;
