import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useGame } from '../hooks/useGame';
import useRoom from '../hooks/useRoom';
import DotGrid from './DotGrid';

const Game = () => {
    const { logRef } = useGame();
    const { roomId, player1, player2, leaveRoom } = useRoom();
    const [copied, setCopied] = useState(false);

    const { started, turn } = useGame();

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
                    <Button
                        variant="danger"
                        onClick={() => leaveRoom()}>
                        Leave
                    </Button>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-7 justify-content-start">
                    <DotGrid
                        rows={12}
                        cols={12}
                    />

                    <div
                        className="bg-light row p-3 ms-0 mt-4"
                        style={{ width: 600, border: '1px solid #ddd' }}>
                        <div
                            className="col d-flex flex-column align-items-center"
                            style={{ color: player1?.color }}>
                            <div>
                                {' '}
                                <b>{player1}</b>{' '}
                            </div>
                            <div>{/* <b>Points: </b> {player1?.points} */}</div>
                            {/* <div><b>Time left: </b>52s</div> */}
                        </div>
                        <div className="col d-flex justify-content-center">
                            <b>V/S</b>
                        </div>
                        <div
                            className="col d-flex flex-column align-items-center align-items-center"
                            style={{ color: player2?.color }}>
                            {!player2 ? (
                                <div className="">Waiting for Opponent...</div>
                            ) : (
                                <div>
                                    {' '}
                                    <b>{player2}</b>{' '}
                                </div>
                            )}
                        </div>
                    </div>
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
