import React, { createContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const url = process.env.REACT_APP_SOCKET_URL;

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [socketError, setSocketError] = useState(null);
    const [isConnected, setIsConnected] = useState(false); // New state for connection status
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        console.log('SocketProvider mounted');
        setLoading(true);
        if (!user) {
            return;
        }

        const newSocket = io(url, {
            auth: {
                user: user,
                secret: process.env.REACT_APP_SECRET,
            },
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
            setLoading(false);
            setSocketError(null);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
            setLoading(false);
        });

        newSocket.on('connect_error', (error) => {
            setSocketError(error);
            setIsConnected(false);
            setLoading(false);
        });

        newSocket.on('authError', (error) => {
            console.log(error);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            console.log('SocketProvider mounted');
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('connect_error');
            newSocket.off('authError');
            newSocket.close();
        };
    }, [user]);

    if (isConnected) {
        return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
    }

    return (
        <div className="d-flex justify-content-center">
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {loading ? (
                    <>
                        <Spinner animation="grow" role="status" />
                        <div className="fs-5 mt-3"> Loading... </div>
                    </>
                ) : (
                    <div className="text-danger text-center">
                        <div className="fs-4">Connection lost</div>
                        {socketError && <p className="text-danger">{socketError.message}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export { SocketContext, SocketProvider };
