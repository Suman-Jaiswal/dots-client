import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import useSocket from '../hooks/useSocket';
import GameBoard from './GameBoard';

export default function Room({ roomId, leaveRoom, player1, player2, isFirstCame }) {
    const [copied, setCopied] = React.useState(false);
    const logRef = useRef(null);
    const { on, off } = useSocket();

    const addMessageElement = (message) => {
        const p = document.createElement('p');
        p.textContent = message;
        logRef.current.appendChild(p);
        logRef.current.scrollTop = logRef.current.scrollHeight;
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
                <div>
                    <Button
                        variant="danger"
                        onClick={leaveRoom}>
                        Leave
                    </Button>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-7 justify-content-start">
                    <GameBoard
                        rows={12}
                        cols={12}
                        roomId={roomId}
                        isFirstCame={isFirstCame}
                        logRef={logRef}
                        player1={player1}
                        player2={player2}
                    />
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
}
