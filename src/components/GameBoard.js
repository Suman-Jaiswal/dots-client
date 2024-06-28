import React, { useRef, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useGame from '../hooks/useGame';
import { Line, Point } from './pojo';

const GameBoard = ({ cols, rows, logRef }) => {
    const { roomId, player1, player2, isFirstCame } = useSelector((state) => state.room);
    const { lines, tiles, started, startGame, makeMove, turn, winner, loading } = useGame(
        roomId,
        logRef
    );

    const [tempLine, setTempLine] = useState(null);
    const startDot = useRef(null);

    const handleDotMouseDown = (row, col) => {
        if (turn === player2) return;
        startDot.current = { row, col };
    };

    const handleDotMouseUp = (e) => {
        e.preventDefault();
        if (turn === player2) return;
        if (startDot.current) {
            if (tempLine) {
                const start = new Point(tempLine.start.row, tempLine.start.col);
                const end = new Point(tempLine.end.row, tempLine.end.col);
                const newLine = new Line(start, end);

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
                    stroke="white"
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

    const overlay = (element) => (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(0deg, rgba(20, 20, 20, 0.8), rgba(25, 25, 25, 0.5)',
            }}>
            <div
                className="text-center"
                style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                }}>
                <div>{element}</div>
            </div>
        </div>
    );

    return (
        <div
            style={{ position: 'relative', border: '1px solid #333' }}
            className="dot-grid w-100 bg-light py-5"
            onMouseMove={handleMouseMove}
            onMouseUp={handleDotMouseUp}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleDotMouseUp}>
            {loading
                ? overlay(<Spinner animation="border" />)
                : winner
                ? overlay(`${winner === player1 ? 'You' : winner} won!`)
                : !player2
                ? overlay('Waiting for opponent to join...')
                : !started && !isFirstCame
                ? overlay(`${player2} will start the game...`)
                : !started &&
                  isFirstCame &&
                  overlay(
                      <Button
                          style={{
                              width: 150,
                              height: 80,
                              fontSize: 50,
                              fontWeight: 'bold',
                          }}
                          onClick={() => startGame([player1, player2])}>
                          Start{' '}
                      </Button>
                  )}
            <svg width={cols * 50} height={rows * 50}>
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
                            fill="white"
                            onMouseDown={() => handleDotMouseDown(rowIndex, colIndex)}
                            onMouseUp={handleDotMouseUp}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                handleDotMouseDown(rowIndex, colIndex);
                            }}
                            onTouchEnd={handleDotMouseUp}
                        />
                    ))
                )}
                {renderTiles()}
            </svg>
        </div>
    );
};

export default GameBoard;
