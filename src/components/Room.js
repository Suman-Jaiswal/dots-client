import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import { gameEmitters } from '../socket/socketEmitters';
import GameBoard from './GameBoard';
import LogCard from './LogCard';
import ScoreCard from './ScoreCard';

export default function Room() {
    const dispatch = useDispatch();
    const { emit } = useSocket();
    const roomId = useSelector((state) => state.room.roomId);

    useEffect(() => {
        gameEmitters(emit, dispatch, roomId).fetchGameData();
    }, [dispatch, emit, roomId]);

    return (
        <div className="mt-2 px-4">
            <div className="row">
                <div className="col-12 col-md-6 py-3 d-flex flex-column align-items-center align-items-md-start">
                    <ScoreCard />
                    <br />
                    <GameBoard rows={5} cols={5} />
                </div>
                <div className="col-12 col-md-6 py-3">
                    <LogCard />
                </div>
            </div>
        </div>
    );
}
