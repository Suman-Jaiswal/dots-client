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
        joinRoomSuccess(state, action) {
            state.roomId = action.payload;
            state.roomJoined = true;
            state.roomError = null;
        },
        leaveRoomSuccess(state) {
            return initialState; // Reset state to initial state
        },
        roomError(state, action) {
            return { ...initialState, roomError: action.payload };
        },
        setPlayers(state, action) {
            state.player1 = action.payload.player1;
            state.player2 = action.payload.player2;
            state.isFirstCame = action.payload.isFirstCame;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        addLog(state, action) {
            state.logs.push(action.payload);
        },
        clearLogs(state) {
            state.logs = [];
        },
    },
});

export const { joinRoomSuccess, leaveRoomSuccess, roomError, setPlayers, setLoading, addLog } =
    roomSlice.actions;

export default roomSlice.reducer;
