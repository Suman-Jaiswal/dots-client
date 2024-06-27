import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useUser from '../hooks/useUser';

const url = process.env.REACT_APP_SOCKET_URL;
// process.env.NODE_ENV === 'development'
//     ? process.env.REACT_APP_LOCAL_SOCKET_URL
//     : process.env.REACT_APP_SOCKET_URL;

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            return;
        }
        try {
            const newSocket = io(url, {
                auth: {
                    user: user,
                    secret: process.env.REACT_APP_SECRET,
                },
            });
            setSocket(newSocket);
        } catch (error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('Connected to server');
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from server');
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
            };
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket.on('authError', (error) => {
                console.log(error);
            });
            return () => {
                socket.off('authError');
            };
        }
    }, [socket]);

    useEffect(() => {
        console.log('SocketProvider mounted');
        return () => {
            console.log('SocketProvider unmounted');
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
