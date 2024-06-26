import { useCallback, useEffect, useReducer } from 'react';
import { Line, Tile } from '../components/pojo';
import useSocket from '../hooks/useSocket';
import { gameActions, gameReducer, initialState } from '../reducers/gameReducer';

const useGame = (roomId, logRef) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { on, off, emit } = useSocket();

    const addMessageElement = useCallback(
        (message) => {
            if (logRef.current) {
                const p = document.createElement('p');
                p.textContent = message;
                logRef.current.appendChild(p);
                logRef.current.scrollTop = logRef.current.scrollHeight;
            }
        },
        [logRef]
    );

    useEffect(() => {
        if (!roomId) {
            return;
        }
        const handleGameStarted = () => {
            dispatch({ type: gameActions.SET_STARTED, payload: true });
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
            addMessageElement(`Player ${turn} made a move`);
        };
        const handleTilesCreated = (tiles) => {
            dispatch({ type: gameActions.ADD_TILES, payload: tiles });
        };
        const handleGameOver = (data) => {
            dispatch({ type: gameActions.SET_WINNER, payload: data.winner });
        };
        on('gameStarted', handleGameStarted);
        on('move', handleMove);
        on('tilesCreated', handleTilesCreated);
        on('gameOver', handleGameOver);
        return () => {
            off('gameStarted');
            off('move');
            off('tilesCreated');
            off('gameOver');
        };
    }, [addMessageElement, off, on, roomId]);

    useEffect(() => {
        if (!roomId) {
            return;
        }
        const fetchGameData = () => {
            emit('fetchGameData', roomId);
            on('gameData', (data) => {
                dispatch({
                    type: gameActions.ADD_LINES,
                    payload: data.lines.map((line) => Line.fromObject(line)),
                });
                dispatch({
                    type: gameActions.ADD_TILES,
                    payload: data.tiles.map((tile) => Tile.fromObject(tile)),
                });
                dispatch({ type: gameActions.SET_WINNER, payload: data.winner });
                dispatch({ type: gameActions.SET_TURN, payload: data.turn });
                dispatch({ type: gameActions.SET_STARTED, payload: data.started });
            });
        };
        fetchGameData();
        return () => {
            off('gameData');
        };
    }, [emit, off, on, roomId]);

    const startGame = (players) => {
        console.log('Starting game');
        emit('startGame', { roomId, players });
    };

    const makeMove = (line) => {
        console.log('Making move');
        emit('move', { roomId, line });
    };

    useEffect(() => {
        console.log('GameProvider mounted', state);
        return () => {
            console.log('GameProvider unmounted');
        };
    }, [roomId, state]);

    return {
        ...state,
        logRef,
        addMessageElement,
        startGame,
        makeMove,
    };
};

export default useGame;
