import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';

export const useGame = () => useContext(GameContext);
