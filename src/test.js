import React, { useState } from 'react';
import useRoom from './hooks/useRoom';

const Test = () => {
    const {
        roomId,
        roomCreated,
        roomJoined,
        roomLeft,
        roomError,
        player1,
        player2,
        createRoom,
        joinRoom,
        leaveRoom,
    } = useRoom();

    const [input, setInput] = useState('');

    return (
        <div>
            {roomCreated && <p>Room Created with ID: {roomId}</p>}
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            {roomJoined && <p>Joined Room with ID: {roomId}</p>}
            {roomLeft && <p>Left the Room</p>}
            {roomError && <p>Error: {roomError}</p>}
            <div>
                <button onClick={createRoom}>Create Room</button>
                <button onClick={() => joinRoom(input)}>Join Room</button>
                <button onClick={leaveRoom}>Leave Room</button>
            </div>
            <div>
                <p>Player 1: {player1}</p>
                <p>Player 2: {player2}</p>
            </div>
        </div>
    );
};

export default Test;
