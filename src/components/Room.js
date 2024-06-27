import React, { useEffect, useMemo, useRef } from 'react';
import { Button } from 'react-bootstrap';
import useSocket from '../hooks/useSocket';
import GameBoard from './GameBoard';
import ScoreCard from './ScoreCard';

export default function Room({ roomId, leaveRoom, player1, player2, isFirstCame }) {
    const [copied, setCopied] = React.useState(false);
    const logRef = useRef(null);
    const { on, off } = useSocket();
    const [playerScores, setPlayerScores] = React.useState([]);

    const player1Score = useMemo(() => {
        return playerScores.filter((score) => score.username === player1)[0]?.score || 0;
    }, [player1, playerScores]);

    const player2Score = useMemo(() => {
        return playerScores.filter((score) => score.username === player2)[0]?.score || 0;
    }, [player2, playerScores]);

    const turn = useMemo(() => {
        return playerScores.filter((score) => score.turn)[0]?.username;
    }, [playerScores]);

    const addMessageElement = (message) => {
        const p = document.createElement('p');
        p.textContent = message.toString();
        logRef.current.appendChild(p);
        logRef.current.scrollTop = logRef.current.scrollHeight;
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.permissions.query({ name: 'clipboard-write' }).then(async (result) => {
                if (result.state === 'granted' || result.state === 'prompt') {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                } else {
                    logRef.current.textContent = 'Clipboard permission denied';
                }
            });
        } catch (error) {
            logRef.current.textContent = 'Error copying room ID: ' + error.toString();
        }
    };

    useEffect(() => {
        if (!logRef.current) {
            return;
        }
        addMessageElement('You joined');
    }, []);

    useEffect(() => {
        if (!logRef.current) {
            return;
        }
        on('message', (data) => {
            addMessageElement(data);
        });
        return () => {
            off('message');
        };
    }, [on, off]);

    return (
        <div className="mt-2 px-4">
            <div className="row">
                <div className="col-12 col-md-6 py-3 d-flex flex-column align-items-center align-items-md-start">
                    <ScoreCard
                        player1={player1}
                        player2={player2}
                        player1Score={player1Score}
                        player2Score={player2Score}
                        turn={turn}
                    />
                    <br />
                    <GameBoard
                        rows={5}
                        cols={5}
                        roomId={roomId}
                        isFirstCame={isFirstCame}
                        logRef={logRef}
                        player1={player1}
                        player2={player2}
                        setPlayerScores={setPlayerScores}
                    />
                </div>
                <div className="col-12 col-md-6 py-3">
                    <div
                        className="d-flex justify-content-between align-items-center w-100 bg-light p-3"
                        style={{ width: '', border: '1px solid #ddd' }}>
                        <div>
                            <b>Room ID: </b> {roomId}
                            <span
                                className="border p-1 ms-2 rounded"
                                role="button"
                                onClick={() => {
                                    try {
                                        copyToClipboard(roomId);
                                    } catch (E) {
                                        logRef.current.textContent =
                                            'Error copying room ID' + E.toString();
                                    }
                                }}>
                                {copied ? 'Copied' : 'Copy'}
                            </span>
                        </div>
                        <div>
                            <Button variant="danger" onClick={leaveRoom}>
                                Leave
                            </Button>
                        </div>
                    </div>
                    <div
                        className="bg-light"
                        style={{ height: '80vh', width: '', border: '1px solid #ddd' }}>
                        {/* <div
                            className="p-3"
                            style={{
                                borderBottom: '1px solid #ddd',
                            }}>
                            <b>Logs</b>
                        </div> */}
                        <div
                            className="mt-3 px-2 text-center text-secondary"
                            ref={logRef}
                            style={{ height: '90%', overflow: 'auto' }}>
                            {' '}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
