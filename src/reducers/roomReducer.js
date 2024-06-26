export const initialState = {
    roomId: null,
    roomJoined: false,
    roomCreated: false,
    roomError: null,
    player1: null,
    player2: null,
    isFirstCame: false,
};

export const roomActions = {
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM',
    LEAVE_ROOM: 'LEAVE_ROOM',
    ROOM_ERROR: 'ROOM_ERROR',
    SET_PLAYERS: 'SET_PLAYERS',
};

export const roomReducer = (state, action) => {
    switch (action.type) {
        case roomActions.CREATE_ROOM:
            return {
                ...state,
                roomCreated: true,
                roomError: null,
            };
        case roomActions.JOIN_ROOM:
            return {
                ...state,
                roomId: action.payload,
                roomJoined: true,
                roomError: null,
            };
        case roomActions.LEAVE_ROOM:
            return {
                ...initialState,
            };
        case roomActions.ROOM_ERROR:
            return {
                ...state,
                roomError: action.payload,
            };
        case roomActions.SET_PLAYERS:
            return {
                ...state,
                player1: action.payload.player1,
                player2: action.payload.player2,
                isFirstCame: action.payload.isFirstCame,
            };

        default:
            return state;
    }
};
