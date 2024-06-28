import { setLoading } from '../reducers/roomReducer';

export const roomEmitters = (emit, dispatch) => {
    const createRoom = () => {
        dispatch(setLoading(true));
        const newRoomId = Math.random().toString(36).substring(2, 9);
        emit('createRoom', newRoomId);
    };

    const joinRoom = (id) => {
        dispatch(setLoading(true));
        emit('joinRoom', id);
    };

    const leaveRoom = (id) => {
        dispatch(setLoading(true));
        emit('leaveRoom', id);
    };

    return {
        createRoom,
        joinRoom,
        leaveRoom,
    };
};
