import { useContext } from 'react';
import { SocketContext } from '../contexts/SocketContext';

const useSocket = () => {
    const socket = useContext(SocketContext);

    const emit = (event, data) => {
        if (socket) {
            socket.emit(event, data);
        }
    };

    const on = (event, callback) => {
        if (socket) {
            socket.on(event, callback);
        }
    };

    const off = (event, callback) => {
        if (socket) {
            socket.off(event, callback);
        }
    };

    return { socket, emit, on, off };
};

export default useSocket;
