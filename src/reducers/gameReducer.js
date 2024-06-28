import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    turn: null,
    started: false,
    lines: [],
    tiles: [],
    playerScores: [],
    winner: null,
    fetching: true,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setTurn(state, { payload }) {
            state.turn = payload;
        },
        setStarted(state, { payload }) {
            state.started = payload;
        },
        setLines(state, { payload }) {
            state.lines = payload;
        },
        setTiles(state, { payload }) {
            state.tiles = payload;
        },
        addLines(state, { payload }) {
            state.lines = [...state.lines, ...payload];
        },
        addTiles(state, { payload }) {
            state.tiles = [...state.tiles, ...payload];
        },
        setWinner(state, { payload }) {
            state.winner = payload;
        },
        setPlayerScores(state, { payload }) {
            state.playerScores = payload;
        },
        setFetching(state, { payload }) {
            state.fetching = payload;
        },
    },
});

export const {
    setTurn,
    setStarted,
    setLines,
    setTiles,
    addLines,
    addTiles,
    setWinner,
    setPlayerScores,
    setFetching,
} = gameSlice.actions;

export default gameSlice.reducer;
