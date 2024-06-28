import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import { roomEmitters } from '../socket/socketEmitters';

const LogCard = () => {
    const dispatch = useDispatch();
    const { emit } = useSocket();
    const logRef = useRef(null);
    const roomId = useSelector((state) => state.room.roomId);
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
        <div>
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
                    className="px-2 text-center"
                    ref={logRef}
                    style={{ height: 'inherit', overflow: 'auto' }}>
                    {logs.map((log, i) => (
                        <p
                            className="my-3"
                            style={{
                                color: log.includes('joined')
                                    ? 'green'
                                    : log.includes('left')
                                    ? 'red'
                                    : log.includes('started') || log.includes('over')
                                    ? 'blue'
                                    : 'grey',
                            }}
                            key={i}>
                            {log.split(':').map((e, j) => (
                                <span
                                    key={j}
                                    style={{
                                        fontWeight: j !== 0 ? 'bold' : 'normal',
                                    }}>
                                    {e}
                                </span>
                            ))}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogCard;
