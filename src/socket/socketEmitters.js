import { setFetching } from '../reducers/gameReducer';
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

export const gameEmitters = (emit, dispatch, roomId) => {
    const fetchGameData = () => {
        dispatch(setFetching(true));
        emit('fetchGameData', roomId);
    };

    const startGame = (players) => {
        console.log('Starting game');
        emit('startGame', { roomId, players });
    };

    const makeMove = (line) => {
        console.log('Making move');
        emit('move', { roomId, line });
    };

    return {
        fetchGameData,
        startGame,
        makeMove,
    };
};
