import { useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import useSocket from '../hooks/useSocket';
import { roomEmitters } from '../socket/socketEmitters';

export default function RoomAction() {
    const dispatch = useDispatch();
    const { emit } = useSocket();
    const [roomIdInput, setRoomIdInputInput] = useState('');

    const handleCreateRoom = () => {
        roomEmitters(emit, dispatch).createRoom();
    };

    const handleJoinRoom = () => {
        roomEmitters(emit, dispatch).joinRoom(roomIdInput);
    };

    return (
        <div className="d-flex mt-4 px-2 row m-auto">
            <div className="col-12 col-md-5 py-3">
                <Button className="w-100" size="lg" variant="success" onClick={handleCreateRoom}>
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
    );
}
