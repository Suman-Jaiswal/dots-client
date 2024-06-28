import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Line, Tile } from '../components/pojo';
import { gameActions } from '../reducers/gameReducer';
import {
    addLog,
    joinRoomSuccess,
    leaveRoomSuccess,
    roomError,
    setLoading,
    setPlayers,
} from '../reducers/roomReducer';

export const useRoomListeners = (on, off, dispatch) => {
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const handleRoomJoined = (id) => {
            dispatch(setLoading(false));
            dispatch(joinRoomSuccess(id));
        };

        const handleRoomLeft = () => {
            dispatch(leaveRoomSuccess());
        };

        const handlePlayerList = (players) => {
            dispatch(
                setPlayers({
                    player1: players.find((player) => player === user?.username),
                    player2: players.find((player) => player !== user?.username),
                    isFirstCame: players[0] === user?.username,
                })
            );
        };

        const handleRoomError = (message) => {
            dispatch(setLoading(false));
            dispatch(roomError(message));
        };

        const handleMessage = (message) => {
            dispatch(addLog(message));
        };

        on('roomJoined', handleRoomJoined);
        on('roomLeft', handleRoomLeft);
        on('playerList', handlePlayerList);
        on('roomError', handleRoomError);
        on('message', handleMessage);

        return () => {
            off('roomJoined', handleRoomJoined);
            off('roomLeft', handleRoomLeft);
            off('playerList', handlePlayerList);
            off('roomError', handleRoomError);
        };
    }, [dispatch, off, on, user?.username]);
};

export const useGameListeners = (on, off, dispatch) => {
    const roomId = useSelector((state) => state.room.roomId);
    useEffect(() => {
        if (!roomId) {
            return;
        }
        const handleGameStarted = (turn) => {
            dispatch({ type: gameActions.SET_STARTED, payload: true });
            dispatch({ type: gameActions.SET_TURN, payload: turn });
        };
        const handleMove = (data) => {
            const { line, tiles, turn } = data;
            const newLine = Line.fromString(line);
            if (tiles) {
                dispatch({
                    type: gameActions.ADD_TILES,
                    payload: tiles.map((tile) => Tile.fromObject(tile)),
                });
            }
            dispatch({ type: gameActions.ADD_LINES, payload: [newLine] });
            dispatch({ type: gameActions.SET_TURN, payload: turn });
            // addMessageElement(`Player ${turn} made a move`);
        };
        const handleTilesCreated = (tiles) => {
            dispatch({ type: gameActions.ADD_TILES, payload: tiles });
        };
        const handleGameOver = (data) => {
            dispatch({ type: gameActions.SET_WINNER, payload: data.winner });
        };

        const handleScore = (playerScores) => {
            dispatch({ type: gameActions.SET_PLAYER_SCORES, payload: playerScores });
        };

        on('gameStarted', handleGameStarted);
        on('move', handleMove);
        on('tilesCreated', handleTilesCreated);
        on('score', handleScore);
        on('gameOver', handleGameOver);
        return () => {
            off('gameStarted');
            off('move');
            off('tilesCreated');
            off('gameOver');
            off('score');
        };
    }, [dispatch, off, on, roomId]);
};
