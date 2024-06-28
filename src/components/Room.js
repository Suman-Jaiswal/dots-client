import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import { roomEmitters } from '../socket/socketEmitters';
import GameBoard from './GameBoard';
import ScoreCard from './ScoreCard';

export default function Room() {
    const dispatch = useDispatch();
    const { emit } = useSocket();
    const roomId = useSelector((state) => state.room.roomId);
    const logRef = useRef(null);
    const logs = useSelector((state) => state.room.logs);

    const [copied, setCopied] = useState(false);

    const addMessageElement = (message) => {
        const p = document.createElement('p');
        p.textContent = message.toString();
        logRef.current.appendChild(p);
        logRef.current.scrollTop = logRef.current.scrollHeight;
    };

    const copyRoomIdToClipboard = async () => {
        try {
            await navigator.permissions.query({ name: 'clipboard-write' }).then(async (result) => {
                if (result.state === 'granted' || result.state === 'prompt') {
                    await navigator.clipboard.writeText(roomId);
                    setCopied(true);
                } else {
                    addMessageElement('Clipboard permission denied');
                }
            });
        } catch (error) {
            console.error('Failed to copy: ', error);
            addMessageElement('Failed to copy room ID');
        }
    };

    const handleLeaveRoom = () => {
        roomEmitters(emit, dispatch).leaveRoom(roomId);
    };

    useEffect(() => {
        logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs]);

    return (
        <div className="mt-2 px-4">
            <div className="row">
                <div className="col-12 col-md-6 py-3 d-flex flex-column align-items-center align-items-md-start">
                    <ScoreCard />
                    <br />
                    <GameBoard rows={5} cols={5} logRef={logRef} />
                </div>
                <div className="col-12 col-md-6 py-3">
                    <div
                        className="d-flex justify-content-between align-items-center w-100 bg-light p-3"
                        style={{ width: '', border: '1px solid #333' }}>
                        <div>
                            <b>Room ID: </b> {roomId}{' '}
                            <span
                                className="border p-1 ms-2 rounded"
                                role="button"
                                onClick={copyRoomIdToClipboard}>
                                {copied ? 'Copied' : 'Copy'}
                            </span>
                        </div>
                        <div>
                            <Button variant="danger" onClick={handleLeaveRoom}>
                                Leave
                            </Button>
                        </div>
                    </div>
                    <div
                        className="bg-light"
                        style={{ height: '80vh', width: '', border: '1px solid #333' }}>
                        <div
                            className="mt-3 px-2 text-center text-secondary"
                            ref={logRef}
                            style={{ height: '90%', overflow: 'auto' }}>
                            {logs.map((log, i) => (
                                <p key={i}>{log}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
