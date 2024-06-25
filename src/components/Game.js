import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useGame } from '../hooks/useGame';
import useRoom from '../hooks/useRoom';
import useUser from '../hooks/useUser';

const Game = () => {
    const { logRef } = useGame();
    const { user } = useUser();
    const { roomId, leaveRoom } = useRoom();
    const [turn, setTurn] = useState(false);
    const [copied, setCopied] = useState(false);
    const [started, setStarted] = useState(false);

    const [player1] = useState({
        name: user?.username,
        points: 0,
        turn: false,
        color: 'blue',
    });

    const [player2, setPlayer2] = useState(null);

    const handleStart = () => {
        setStarted(true);
        setTurn(true);
    };

    return (
        <div className="mt-3 px-4">
            <div className="d-flex justify-content-between">
                <div>
                    {' '}
                    <b>Room ID: </b> {roomId}{' '}
                    <span
                        className="border p-1 ms-2 rounded"
                        role="button"
                        onClick={() => {
                            navigator?.clipboard?.writeText(roomId).then(() => setCopied(true));
                        }}>
                        {copied ? 'Copied' : 'Copy'}
                    </span>
                </div>
                {started && <div className="h5">{turn ? 'Your turn' : "Opponent's turn"}</div>}
                <div>
                    <Button variant="danger" onClick={() => leaveRoom()}>
                        Leave
                    </Button>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-7 justify-content-start">
                    {/* <DotGrid rows={12} cols={12} player1={player1} player2={player2} roomId={roomId} turn={turn} addMessageEl={addMessageElemnt} /> */}

                    {!player2 ? (
                        <div className="mt-4">Waiting for Opponent to join...</div>
                    ) : (
                        <div
                            className="bg-light row p-3 ms-0 mt-4"
                            style={{ width: 600, border: '1px solid #ddd' }}>
                            <div
                                className="col d-flex flex-column align-items-center"
                                style={{ color: player1?.color }}>
                                <div>
                                    {' '}
                                    <b>{player1?.name}</b>{' '}
                                </div>
                                <div>
                                    <b>Points: </b> {player1?.points}
                                </div>
                                {/* <div><b>Time left: </b>52s</div> */}
                            </div>
                            <div className="col d-flex justify-content-center">
                                {!started ? (
                                    <Button onClick={handleStart}>Start</Button>
                                ) : (
                                    <b>V/S</b>
                                )}
                            </div>
                            <div
                                className="col d-flex flex-column align-items-center align-items-center"
                                style={{ color: player2?.color }}>
                                <div>
                                    {' '}
                                    <b>{player2?.name}</b>{' '}
                                </div>
                                <div>
                                    <b>Points: </b> {player2?.points}
                                </div>
                                {/* <div><b>Time left: </b>52s</div> */}
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="col bg-light"
                    style={{ height: '80vh', width: '', border: '1px solid #ddd' }}>
                    <div
                        className="p-3"
                        style={{
                            borderBottom: '1px solid #ddd',
                        }}>
                        <b>Logs</b>
                    </div>
                    <div
                        className="mt-3 px-2 text-center text-secondary"
                        ref={logRef}
                        style={{ height: '90%', overflow: 'auto' }}>
                        {' '}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
