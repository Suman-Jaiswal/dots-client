export const initialState = {
    turn: null,
    started: false,
    lines: [],
    tiles: [],
    winner: null,
};

export const gameActions = {
    SET_TURN: 'SET_TURN',
    SET_STARTED: 'SET_STARTED',
    ADD_LINES: 'ADD_LINES',
    ADD_TILES: 'ADD_TILES',
    SET_WINNER: 'SET_WINNER',
};

export const gameReducer = (state, action) => {
    switch (action.type) {
        case gameActions.SET_TURN:
            return { ...state, turn: action.payload };
        case gameActions.SET_STARTED:
            return { ...state, started: action.payload };
        case gameActions.ADD_LINES:
            return { ...state, lines: [...state.lines, ...action.payload] };
        case gameActions.ADD_TILES:
            return { ...state, tiles: [...state.tiles, ...action.payload] };
        case gameActions.SET_WINNER:
            return { ...state, winner: action.payload };
        default:
            return state;
    }
};
