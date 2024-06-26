import { useCallback, useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

const useSocket = () => {
    const socket = useContext(SocketContext);

    const emit = useCallback(
        (event, data) => {
            if (socket) {
                socket.emit(event, data);
            }
        },
        [socket]
    );

    const on = useCallback(
        (event, callback) => {
            if (socket) {
                socket.on(event, callback);
            }
        },
        [socket]
    );

    const off = useCallback(
        (event) => {
            if (socket) {
                socket.off(event);
            }
        },
        [socket]
    );

    return { socket, emit, on, off };
};

export default useSocket;
