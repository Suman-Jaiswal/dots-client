import React, { createContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import useUser from '../hooks/useUser';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
    const [roomId, setRoomId] = useState(null);
    const [roomJoined, setRoomJoined] = useState(false);
    const [roomCreated, setRoomCreated] = useState(false);
    const [roomError, setRoomError] = useState(null);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);

    const { on, off, emit, socket } = useSocket();
    const { user } = useUser();

    useEffect(() => {
        console.log('RoomProvider mounted');
        return () => {
            console.log('RoomProvider unmounted');
        };
    }, []);

    useEffect(() => {
        const storedRoomId = localStorage.getItem('roomId');
        if (!storedRoomId) {
            return;
        }
        if (!socket) {
            return;
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

        on('playerList', (players) => {
            console.log('Player list:', players);
            setPlayer1(players.filter((player) => player === user?.username)[0]);
            setPlayer2(players.filter((player) => player !== user?.username)[0]);
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
            off('playerList');
        };
    }, [off, on, setRoomCreated, setRoomError, setRoomId, setRoomJoined, socket, user?.username]);

    return (
        <RoomContext.Provider
            value={{
                roomId,
                roomJoined,
                roomCreated,
                roomError,
                player1,
                player2,
            }}>
            {children}
        </RoomContext.Provider>
    );
};

export { RoomContext, RoomProvider };
