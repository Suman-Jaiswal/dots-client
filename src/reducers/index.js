import { combineReducers } from 'redux';
import { gameReducer } from './gameReducer';
import { roomReducer } from './roomReducer';
import userReducer from './userReducer';
// import { playerReducer } from './playerReducer';

const rootReducer = combineReducers({
    user: userReducer,
    room: roomReducer,
    game: gameReducer,
});

export default rootReducer;
