import React, { useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import useRoom from '../hooks/useRoom';
import useUser from '../hooks/useUser';
import Header from './Header';
import Room from './Room';

const Lobby = () => {
    const { error } = useUser();
    const {
        roomId,
        roomJoined,
        roomError,
        player1,
        player2,
        isFirstCame,
        createRoom,
        joinRoom,
        leaveRoom,
        message,
    } = useRoom();

    const [roomIdInput, setRoomIdInputInput] = useState('');

    const handleCreateRoom = () => {
        createRoom();
    };

    const handleJoinRoom = () => {
        if (roomIdInput) {
            joinRoom(roomIdInput);
        }
    };

    return (
        <div>
            <Header disabled={roomJoined} />
            {message ? (
                <div className="mt-5 text-center text-success">{message}</div>
            ) : error ? (
                <div className="mt-5 text-center text-danger">{error}</div>
            ) : roomJoined ? (
                <Room
                    roomId={roomId}
                    leaveRoom={leaveRoom}
                    player1={player1}
                    player2={player2}
                    isFirstCame={isFirstCame}
                />
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
