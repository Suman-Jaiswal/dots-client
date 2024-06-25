import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import useRoom from '../hooks/useRoom';
import useSocket from '../hooks/useSocket';
import useUser from '../hooks/useUser';

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const { on, off, emit } = useSocket();
  const { user } = useUser();
  const { roomId } = useRoom();

  const [turn, setTurn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [started, setStarted] = useState(false);
  const logRef = useRef(null);

  const [player1] = useState({
    name: user?.username,
    points: 0,
    turn: false,
    color: 'blue'
  });
  const [player2, setPlayer2] = useState(null);

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
      addMessageElement(playerId === user.username ? `You joined` : `${playerId} joined`);
    });

    return () => {
      off('message');
      off('newPlayer');
    };
  }, [addMessageElement, off, on, roomId, user.username]);

  const handleStart = () => {
    setStarted(true);
    setTurn(true);
    emit('startGame', roomId);
  };

  const value = {
    turn,
    setTurn,
    copied,
    setCopied,
    started,
    setStarted,
    logRef,
    player1,
    player2,
    setPlayer2,
    addMessageElement,
    handleStart,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };

