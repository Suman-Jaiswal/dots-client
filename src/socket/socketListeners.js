import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    addLines,
    addTiles,
    setFetching,
    setLines,
    setPlayerScores,
    setStarted,
    setTiles,
    setTurn,
    setWinner,
} from '../reducers/gameReducer';
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
            dispatch(joinRoomSuccess(id));
            dispatch(setLoading(false));
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
            dispatch(roomError(message));
            dispatch(setLoading(false));
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
            off('roomJoined');
            off('roomLeft');
            off('playerList');
            off('roomError');
            off('message');
        };
    }, [dispatch, off, on, user?.username]);
};

export const useGameListeners = (on, off, dispatch) => {
    const roomJoined = useSelector((state) => state.room.roomJoined);
    useEffect(() => {
        if (!roomJoined) {
            return;
        }

        const handleGameData = (data) => {
            dispatch(setLines(data.lines));
            dispatch(setTiles(data.tiles));
            dispatch(setTurn(data.turn));
            dispatch(setWinner(data.winner));
            dispatch(setStarted(data.started));
            dispatch(setPlayerScores(data.playerScores));
            dispatch(setFetching(false));
        };

        const handleGameStarted = (turn) => {
            dispatch(setStarted(true));
            dispatch(setTurn(turn));
        };
        const handleMove = (data) => {
            const { newLine, newTiles, turn } = data;
            if (newTiles && newTiles.length > 0) {
                dispatch(addTiles(newTiles));
            }
            dispatch(addLines([newLine]));
            dispatch(setTurn(turn));
            const audioEl = document.createElement('audio');
            audioEl.src = 'connect.wav';
            audioEl.play();
        };
        const handleGameOver = (winner) => {
            dispatch(setWinner(winner));
            dispatch(addLog('Game over! Winner: ' + winner));
        };

        const handleScore = (playerScores) => {
            dispatch(setPlayerScores(playerScores));
        };

        on('gameData', handleGameData);
        on('gameStarted', handleGameStarted);
        on('move', handleMove);
        on('score', handleScore);
        on('gameOver', handleGameOver);

        return () => {
            off('gameData');
            off('gameStarted');
            off('move');
            off('score');
            off('gameOver');
        };
    }, [dispatch, off, on, roomJoined]);
};
