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
            {error ? (
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
                <div className="d-flex mt-5 w-50 m-auto">
                    <Button
                        className="w-50 me-3"
                        size="lg"
                        variant="success"
                        onClick={handleCreateRoom}>
                        Create Room
                    </Button>
                    <InputGroup>
                        <FormControl
                            type="text"
                            placeholder="Enter Room ID"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInputInput(e.target.value)}
                        />
                        <Button
                            size="lg"
                            onClick={handleJoinRoom}>
                            Join Room
                        </Button>
                    </InputGroup>
                </div>
            )}
            {roomError && <div className="mt-5 text-center text-danger">{roomError}</div>}
        </div>
    );
};

export default Lobby;
