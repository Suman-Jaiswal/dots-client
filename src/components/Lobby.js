import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import { roomEmitters } from '../socket/socketEmitters';
import { useGameListeners, useRoomListeners } from '../socket/socketListeners';
import Room from './Room';
import RoomAction from './RoomAction';

const Lobby = () => {
    const dispatch = useDispatch();
    const { emit, on, off } = useSocket();
    useRoomListeners(on, off, dispatch);
    useGameListeners(on, off, dispatch);

    const error = useSelector((state) => state.user.error);
    const { roomJoined, roomError, loading, roomId } = useSelector((state) => state.room);

    useEffect(() => {
        if (!roomJoined && roomId) {
            roomEmitters(emit, dispatch).joinRoom(roomId);
        }
    }, [dispatch, emit, roomId, roomJoined]);

    return (
        <div>
            {loading ? (
                <div className="mt-5 text-center text-light fs-5">
                    <Spinner animation="border" size="lg" className="mt-5 me-2" />
                </div>
            ) : error ? (
                <div className="mt-5 text-center text-danger">{error}</div>
            ) : roomJoined ? (
                <Room />
            ) : (
                <RoomAction />
            )}
            {roomError && <div className="mt-5 text-center text-danger">{roomError}</div>}
        </div>
    );
};

export default Lobby;
