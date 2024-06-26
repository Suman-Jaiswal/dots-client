import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import useGame from '../hooks/useGame';
import { Line, Point } from './pojo';

const GameBoard = ({ rows, cols, isFirstCame, logRef, roomId, player1, player2 }) => {
    const { lines, tiles, started, startGame, makeMove, turn, playerScores } = useGame(
        roomId,
        [player1, player2],
        logRef
    );

    const [tempLine, setTempLine] = useState(null);
    const startDot = useRef(null);

    const handleDotMouseDown = (row, col) => {
        if (turn === player2) return;
        startDot.current = { row, col };
    };

    const handleDotMouseUp = () => {
        if (turn === player2) return;
        if (startDot.current) {
            if (tempLine) {
                const start = new Point(tempLine.start.row, tempLine.start.col);
                const end = new Point(tempLine.end.row, tempLine.end.col);
                const newLine = new Line(start, end);

                console.log('newLine', newLine);

                if (lines.some((line) => line.equals(newLine))) {
                    startDot.current = null;
                    setTempLine(null);
                    return;
                }
                makeMove(newLine.toString());
                const audioEl = document.createElement('audio');
                audioEl.src = 'connect.wav';
                audioEl.play();
            }

            startDot.current = null;
            setTempLine(null);
        }
    };

    const handleMouseMove = (event) => {
        if (turn === player2) return;
        if (startDot.current) {
            const svg = event.target.closest('svg');
            const rect = svg?.getBoundingClientRect();
            if (!rect) return;
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const start = startDot.current;
            const end = getClosestDot(x, y);

            if (isAdjacent(start, end)) {
                setTempLine({ start, end });
            } else {
                setTempLine(null);
            }
        }
    };

    const getClosestDot = (x, y) => {
        const col = Math.round((x - 25) / 50);
        const row = Math.round((y - 25) / 50);
        return { row, col };
    };

    const isAdjacent = (dot1, dot2) => {
        return (
            (Math.abs(dot1.row - dot2.row) === 1 && dot1.col === dot2.col) ||
            (Math.abs(dot1.col - dot2.col) === 1 && dot1.row === dot2.row)
        );
    };

    const renderLines = () => {
        return lines.map((line, index) => {
            const { start, end } = line;
            return (
                <line
                    key={`line-${index}`}
                    x1={`${start.col * 50 + 25}`}
                    y1={`${start.row * 50 + 25}`}
                    x2={`${end.col * 50 + 25}`}
                    y2={`${end.row * 50 + 25}`}
                    stroke="black"
                    strokeWidth="2"
                />
            );
        });
    };

    const renderTempLine = () => {
        if (tempLine) {
            const { start, end } = tempLine;
            return (
                <line
                    x1={`${start.col * 50 + 25}`}
                    y1={`${start.row * 50 + 25}`}
                    x2={`${end.col * 50 + 25}`}
                    y2={`${end.row * 50 + 25}`}
                    stroke="gray"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />
            );
        }
        return null;
    };

    const renderTiles = () => {
        return tiles.map((tile, index) => {
            const { point, player } = tile;
            const color = player === player1 ? 'blue' : 'red';
            return (
                <rect
                    key={`tile-${index}`}
                    x={point.col * 50 + 25}
                    y={point.row * 50 + 25}
                    width="50"
                    height="50"
                    fill={color}
                    stroke="black"
                />
            );
        });
    };

    if (!started) {
        return (
            <div
                style={{
                    position: 'relative',
                }}
                className="dot-grid">
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'linear-gradient(45deg, rgba(1, 1, 1, 0.5), rgba(1, 1, 1, 0.8)',
                    }}>
                    {!player2 ? (
                        <div
                            className="text-center"
                            style={{
                                width: 200,
                                height: 100,
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'white',
                            }}>
                            Waiting for Opponent to join...
                        </div>
                    ) : isFirstCame ? (
                        <Button
                            style={{
                                width: 200,
                                height: 100,
                                fontSize: 50,
                                fontWeight: 'bold',
                            }}
                            onClick={() => startGame([player1, player2])}>
                            Start
                        </Button>
                    ) : (
                        <div
                            className="text-center"
                            style={{
                                width: 200,
                                height: 100,
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'white',
                            }}>
                            Opponent will start the game
                        </div>
                    )}
                </div>
                <svg
                    width={cols * 50}
                    height={rows * 50}>
                    {Array.from({ length: rows }).map((_, rowIndex) =>
                        Array.from({ length: cols }).map((_, colIndex) => (
                            <circle
                                key={`dot-${rowIndex}-${colIndex}`}
                                cx={colIndex * 50 + 25}
                                cy={rowIndex * 50 + 25}
                                r="6"
                                fill="gray"
                            />
                        ))
                    )}
                </svg>
            </div>
        );
    }

    return (
        <>
            <div
                className="dot-grid"
                onMouseMove={handleMouseMove}
                onMouseUp={handleDotMouseUp}>
                <svg
                    width={cols * 50}
                    height={rows * 50}>
                    {renderLines()}
                    {renderTempLine()}
                    {Array.from({ length: rows }).map((_, rowIndex) =>
                        Array.from({ length: cols }).map((_, colIndex) => (
                            <circle
                                style={{ cursor: turn === player1 ? 'pointer' : '' }}
                                key={`dot-${rowIndex}-${colIndex}`}
                                cx={colIndex * 50 + 25}
                                cy={rowIndex * 50 + 25}
                                r="6"
                                fill="black"
                                onMouseDown={() => handleDotMouseDown(rowIndex, colIndex)}
                                onMouseUp={handleDotMouseUp}
                            />
                        ))
                    )}
                    {renderTiles()}
                </svg>
            </div>
            <div
                className="bg-light row p-3 ms-0 mt-4"
                style={{ width: 600, border: '1px solid #ddd' }}>
                <div
                    className="col d-flex flex-column align-items-center"
                    style={{ color: 'blue' }}>
                    <div>
                        {' '}
                        <b>{player1}</b>{' '}
                    </div>
                    <div>
                        <b>Score: </b> {playerScores.map((p) => p.username === player1).score}
                    </div>
                    {/* <div><b>Time left: </b>52s</div> */}
                </div>
                <div className="col d-flex justify-content-center">
                    <b>V/S</b>
                </div>
                <div
                    className="col d-flex flex-column align-items-center align-items-center"
                    style={{ color: 'red' }}>
                    {!player2 ? (
                        <div className="">Waiting for Opponent...</div>
                    ) : (
                        <div>
                            <div>
                                {' '}
                                <b>{player2}</b>{' '}
                            </div>
                            <div>
                                <b>Score: </b>{' '}
                                {playerScores.map((p) => p.username === player2).score}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default GameBoard;
