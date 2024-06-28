import { useCallback, useEffect, useReducer, useState } from 'react';
import { Line, Tile } from '../components/pojo';
import useSocket from '../hooks/useSocket';
import { gameActions, gameReducer, initialState } from '../reducers/gameReducer';
import { useGameListeners } from '../socket/socketListeners';

const useGame = (roomId, logRef) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { on, off, emit } = useSocket();
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
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
                dispatch({ type: gameActions.SET_PLAYER_SCORES, payload: data.playerScores });
                setLoading(false);
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
        console.log('GameProvider mounted');
    }, [roomId, state]);

    useGameListeners(on, off, dispatch);

    return {
        ...state,
        logRef,
        loading,
        addMessageElement,
        startGame,
        makeMove,
    };
};

export default useGame;
