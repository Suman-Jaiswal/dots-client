import { useEffect, useReducer } from 'react';
import useSocket from '../hooks/useSocket';
import useUser from '../hooks/useUser';
import { initialState, roomActions, roomReducer } from '../reducers/roomReducer';

const useRoom = () => {
    const [state, dispatch] = useReducer(roomReducer, initialState);
    const { on, off, emit, socket } = useSocket();
    const { user } = useUser();

    useEffect(() => {
        const storedRoomId = localStorage.getItem('roomId');
        if (storedRoomId && socket) {
            emit('joinRoom', storedRoomId);
            console.log('Joining room', storedRoomId);
        }
    }, [emit, socket]);

    useEffect(() => {
        if (!socket) return;

        const handleRoomCreated = (id) => {
            dispatch({ type: roomActions.CREATE_ROOM, payload: id });
            localStorage.setItem('roomId', id);
        };

        const handleRoomJoined = (id) => {
            dispatch({ type: roomActions.JOIN_ROOM, payload: id });
            localStorage.setItem('roomId', id);
        };

        const handleRoomLeft = () => {
            dispatch({ type: roomActions.LEAVE_ROOM });
            localStorage.removeItem('roomId');
        };

        const handlePlayerList = (players) => {
            dispatch({
                type: roomActions.SET_PLAYERS,
                payload: {
                    player1: players.find((player) => player === user?.username),
                    player2: players.find((player) => player !== user?.username),
                    isFirstCame: players[0] === user?.username,
                },
            });
        };

        const handleRoomError = (message) => {
            console.log(message);
            dispatch({ type: roomActions.ROOM_ERROR, payload: message });
            localStorage.removeItem('roomId');
        };

        on('roomCreated', handleRoomCreated);
        on('roomJoined', handleRoomJoined);
        on('roomLeft', handleRoomLeft);
        on('playerList', handlePlayerList);
        on('roomError', handleRoomError);

        return () => {
            off('roomCreated', handleRoomCreated);
            off('roomJoined', handleRoomJoined);
            off('roomLeft', handleRoomLeft);
            off('playerList', handlePlayerList);
            off('roomError', handleRoomError);
        };
    }, [on, off, socket, user?.username]);

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 9);
        emit('createRoom', newRoomId);
    };

    const joinRoom = (id) => {
        emit('joinRoom', id);
    };

    const leaveRoom = () => {
        console.log('Leaving room', state.roomId);
        emit('leaveRoom', state.roomId);
    };

    useEffect(() => {
        console.log('RoomProvider mounted');
        return () => {
            console.log('RoomProvider unmounted');
        };
    }, [state]);

    return {
        ...state,
        createRoom,
        joinRoom,
        leaveRoom,
    };
};

export default useRoom;
