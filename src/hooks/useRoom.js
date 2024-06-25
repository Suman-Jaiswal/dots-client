import { useContext } from 'react';
import { RoomContext } from '../contexts/RoomContext';
import useSocket from './useSocket';

const useRoom = () => {
    const { roomId, roomJoined, roomLeft, roomCreated, roomError, player1, player2 } =
        useContext(RoomContext);

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
        player1,
        player2,
        createRoom,
        joinRoom,
        leaveRoom,
    };
};

export default useRoom;
