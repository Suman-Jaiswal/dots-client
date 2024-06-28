import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import { roomEmitters } from '../socket/socketEmitters';
import { useGameListeners, useRoomListeners } from '../socket/socketListeners';
import Room from './Room';

const Lobby = () => {
    const dispatch = useDispatch();
    const { emit, on, off } = useSocket();
    useRoomListeners(on, off, dispatch);
    useGameListeners(on, off, dispatch);

    const error = useSelector((state) => state.user.error);
    const { roomJoined, roomError, loading, roomId } = useSelector((state) => state.room);

    const [roomIdInput, setRoomIdInputInput] = useState('');

    const handleCreateRoom = () => {
        roomEmitters.createRoom();
    };

    const handleJoinRoom = () => {
        if (roomIdInput) {
            roomEmitters(emit, dispatch).joinRoom(roomIdInput);
        }
    };

    useEffect(() => {
        if (roomId) {
            roomEmitters(emit, dispatch).joinRoom(roomId);
        }
    }, [roomId, dispatch, emit]);

    return (
        <div>
            {loading ? (
                <div className="mt-5 text-center text-success">Rejoining room: {roomId}</div>
            ) : error ? (
                <div className="mt-5 text-center text-danger">{error}</div>
            ) : roomJoined ? (
                <Room />
            ) : (
                <div className="d-flex mt-4 px-2 row m-auto">
                    <div className="col-12 col-md-5 py-3">
                        <Button
                            className="w-100"
                            size="lg"
                            variant="success"
                            onClick={handleCreateRoom}>
                            Create Room
                        </Button>
                    </div>
                    <div className="col-12 col-md-7 py-3">
                        <InputGroup className="w-100">
                            <FormControl
                                type="text"
                                placeholder="Enter Room ID"
                                value={roomIdInput}
                                onChange={(e) => setRoomIdInputInput(e.target.value)}
                            />
                            <Button size="lg" onClick={handleJoinRoom}>
                                Join Room
                            </Button>
                        </InputGroup>
                    </div>
                </div>
            )}
            {roomError && <div className="mt-5 text-center text-danger">{roomError}</div>}
        </div>
    );
};

export default Lobby;
