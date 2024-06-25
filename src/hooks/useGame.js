import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import useRoom from './useRoom';
import useSocket from './useSocket';

export const useGame = () => {
    const {
        turn,
        setTurn,
        started,
        setStarted,
        logRef,
        addMessageElement,
        handleStart,
        lines,
        setLines,
        tiles,
        setTiles,
        winner,
        setWinner,
    } = useContext(GameContext);

    const { roomId, player1, player2 } = useRoom();
    const { emit } = useSocket();

    const startGame = (players) => {
        setStarted(true);
        emit('startGame', { roomId, players: [player1, player2] });
    };

    const fetchGameData = () => {
        emit('fetchGameData', roomId);
    };

    return {
        turn,
        setTurn,
        started,
        setStarted,
        logRef,
        addMessageElement,
        handleStart,
        lines,
        setLines,
        tiles,
        setTiles,
        winner,
        setWinner,
        startGame,
        fetchGameData,
    };
};
