import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import useRoom from '../hooks/useRoom';
import useSocket from '../hooks/useSocket';
import useUser from '../hooks/useUser';

const GameContext = createContext();

const GameProvider = ({ children }) => {
    const { on, off, emit } = useSocket();
    const { user } = useUser();
    const { roomId } = useRoom();
    const logRef = useRef(null);

    const [turn, setTurn] = useState(null);
    const [started, setStarted] = useState(null);
    const [lines, setLines] = useState([]);
    const [tiles, setTiles] = useState([]);
    const [winner, setWinner] = useState(null);

    const addMessageElement = useCallback((message) => {
        const p = document.createElement('p');
        p.textContent = message;
        logRef.current.appendChild(p);
        logRef.current.scrollTop = logRef.current.scrollHeight;
    }, []);

    useEffect(() => {
        if (!roomId) {
            return;
        }

        on('message', (data) => {
            addMessageElement(data);
        });

        on('newPlayer', (playerId) => {
            console.log('newPlayer', playerId);
            addMessageElement(playerId === user?.username ? `You joined` : `${playerId} joined`);
        });

        return () => {
            off('message');
            off('newPlayer');
        };
    }, [addMessageElement, off, on, roomId, user?.username]);

    useEffect(() => {
        if (!roomId) {
            return;
        }
        on('gameStarted', () => {
            setStarted(true);
        });
        return () => {
            off('gameStarted');
        };
    }, [off, on, roomId]);

    useEffect(() => {
        if (!roomId) {
            return;
        }
        emit('fetchGameData', roomId);
        on('gameData', (data) => {
            setLines(data.lines);
            setTiles(data.tiles);
            setWinner(data.winner);
            setTurn(data.turn);
            setStarted(data.started);
        });
        return () => {
            off('gameData');
        };
    }, [roomId]);

    useEffect(() => {
        console.log('GameProvider mounted');
        console.log('State', { turn, started, lines, tiles, winner });
        return () => {
            console.log('GameProvider unmounted');
        };
    }, [lines, started, tiles, turn, winner]);

    const handleStart = () => {
        setStarted(true);
        setTurn(true);
        emit('startGame', roomId);
    };

    const value = {
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
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export { GameContext, GameProvider };
