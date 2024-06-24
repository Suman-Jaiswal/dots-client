import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import DotGrid from './DotGrid';
const Game = ({ roomId, socket, user }) => {
  const [message, setMessage] = useState("");
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

  const addMessageElemnt = (message) => {
    const p = document.createElement('p');
    p.textContent = message;
    logRef.current.appendChild(p);
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }

  useEffect(() => {
    socket.on('move', (data) => {
      const { player, line, turn } = data;
      setTurn(turn);
      console.log('Move received:', data);
      addMessageElemnt(`${player} made a move: ${line}`);
    });

    socket.on('gameStarted', (whoseTurn) => {
      console.log('Game started:', whoseTurn);
      setStarted(true);
      addMessageElemnt('Game started by ' + whoseTurn);
    }
    );

    socket.on('newPlayer', (playerId) => {
      console.log('New player joined:', playerId);
      setPlayer2({
        name: playerId,
        points: 0,
        turn: false,
        color: 'red'
      });
      addMessageElemnt(playerId === user.username ? `You joined` : `${playerId} joined`);
    });

    socket.on('playerLeft', (playerId) => {
      addMessageElemnt(`${playerId} left`);
      setPlayer2(null);
    });

    return () => {
      socket.off('move');
      socket.off('newPlayer');
      socket.off('playerLeft');
      socket.off('roomMembers');
      socket.off('gameStarted');
    };
  }, [roomId, socket, user.username]);

  // const getRoomData = useCallback(() => {
  //   socket.emit('getRoomMembers', roomId);

  //   return () => {
  //     socket.off('roomMembers');
  //   }
  // }, [roomId, socket]);

  useEffect(() => {
    const getRoomData = () => {
      socket.emit('getRoomMembers', roomId);
    }
    socket.on('roomMembers', (data) => {
      console.log('Room members:', data);
      addMessageElemnt('You joined');
      if (data.length === 2) {
        setPlayer2({
          name: data.find(player => player !== user.username),
          points: 0,
          turn: false,
          color: 'red'
        });
      }
    });
    return getRoomData;
  }, [roomId, socket, user.username]);

  const handleStart = () => {
    socket.emit('startGame', roomId);
    setStarted(true);
    setTurn(true);
    addMessageElemnt('You started the game');
  }

  return (
    <div className='mt-3 px-4'>
      <div className='d-flex justify-content-between' >
        <div> <b>Room ID: </b> {roomId} <span className='border p-1 ms-2 rounded' role='button' onClick={() => {
          navigator?.clipboard?.writeText(roomId).then(() =>
            setCopied(true)
          )
        }}>{copied ? "Copied" : "Copy"}</span></div>
        {
          started &&
          <div className="h5">{turn ? 'Your turn' : "Opponent's turn"}</div>
        }
        <div>
          <Button variant='danger' onClick={() => {
            socket.emit('leaveRoom', roomId);
          }
          }>Leave</Button>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-7 justify-content-start">
          <DotGrid rows={12} cols={12} player1={player1} player2={player2} socket={socket} roomId={roomId} turn={turn} addMessageEl={addMessageElemnt} />

          {
            !player2 ? <div className='mt-4'>Waiting for Player to join...</div>
              :
              <div className="bg-light row p-3 ms-0 mt-4" style={{ width: 600, border: '1px solid #ddd' }}>
                <div className="col d-flex flex-column align-items-center" style={{ color: player1?.color }}>
                  <div> <b>{player1?.name}</b> </div>
                  <div><b>Points: </b> {player1?.points}</div>
                  {/* <div><b>Time left: </b>52s</div> */}
                </div>
                <div className="col d-flex justify-content-center">
                  {!started ? <Button onClick={handleStart}>Start</Button> : <b>V/S</b>}
                </div>
                <div className="col d-flex flex-column align-items-center align-items-center" style={{ color: player2?.color }}>
                  <div> <b>{player2?.name}</b> </div>
                  <div><b>Points: </b> {player2?.points}</div>
                  {/* <div><b>Time left: </b>52s</div> */}
                </div>
              </div>}
        </div>
        <div className="col bg-light" style={{ height: '80vh', width: '', border: '1px solid #ddd' }} >
          <div className='p-3' style={{
            borderBottom: '1px solid #ddd'
          }}>
            <b>Logs</b>
          </div>
          <div className='mt-3 px-2 text-center text-secondary' ref={logRef} style={{ height: '90%', overflow: 'auto' }}> </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
