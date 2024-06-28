import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    roomId: null,
    roomJoined: false,
    roomError: null,
    player1: null,
    player2: null,
    isFirstCame: false,
    loading: null,
    logs: [],
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        joinRoomSuccess(state, { payload }) {
            state.roomId = payload;
            state.roomJoined = true;
            state.roomError = null;
        },
        leaveRoomSuccess(state) {
            return initialState; // Reset state to initial state
        },
        roomError(state, { payload }) {
            return { ...initialState, roomError: payload };
        },
        setPlayers(state, { payload }) {
            state.player1 = payload.player1;
            state.player2 = payload.player2;
            state.isFirstCame = payload.isFirstCame;
        },
        setLoading(state, { payload }) {
            state.loading = payload;
        },
        addLog(state, { payload }) {
            state.logs.push(payload);
        },
        clearLogs(state) {
            state.logs = [];
        },
    },
});

export const { joinRoomSuccess, leaveRoomSuccess, roomError, setPlayers, setLoading, addLog } =
    roomSlice.actions;

export default roomSlice.reducer;
