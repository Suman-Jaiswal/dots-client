import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { USE_LOCAL_SERVER } from '../constants';
import useSocket from '../hooks/socket';
import Game from './Game';

const Lobby = ({ user, roomId, setRoomId }) => {
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [message, setMessage] = useState(null);

  const socket = useSocket(USE_LOCAL_SERVER ? process.env.REACT_APP_LOCAL_SOCKET_URL : process.env.REACT_APP_SOCKET_URL, user);

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 9);
    socket.emit('createRoom', newRoomId);
    socket.on('roomCreated', (id) => {
      setRoomId(id);
      localStorage.setItem('roomId', id);
      setJoinedRoom(true);
    });
  };

  const handleJoinRoom = () => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
      socket.on('roomJoined', (id) => {
        setRoomId(id);
        localStorage.setItem('roomId', id);
        setJoinedRoom(true);
      });
    }
  };

  useEffect(() => {
    if (socket) {
      if (localStorage.getItem('roomId')) {
        socket.emit('joinRoom', localStorage.getItem('roomId'));
        socket.on('roomJoined', (id) => {
          setRoomId(id);
          localStorage.setItem('roomId', id);
          setJoinedRoom(true);
          setMessage(null);
        });
      }

      socket.on('roomLeft', () => {
        setJoinedRoom(false);
        setRoomId(null);
        localStorage.removeItem('roomId');
      }
      );

      socket.on('error', (message) => {
        setMessage(message);
      });

      socket.on('unauthorized', (message) => {
        setMessage(message);
      }
      );
    }
  }, [setRoomId, socket]);

  return (
    <div>
      {joinedRoom ? (
        <Game roomId={roomId} socket={socket} user={user} />
      ) : (
        <div className='d-flex mt-5 w-50 m-auto'>
          <Button className='w-50 me-3' size='lg' variant='success' onClick={handleCreateRoom}>Create Room</Button>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Button size='lg' onClick={handleJoinRoom}>Join Room</Button>
          </InputGroup>
        </div>)
      }
      <div className='mt-5 text-center text-danger'>{message}</div>

    </div>
  );
};

export default Lobby;
