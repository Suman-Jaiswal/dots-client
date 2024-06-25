import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useGame } from '../hooks/useGame';
import useSocket from '../hooks/useSocket';
import { Line, Point } from './pojo';

const DotGrid = ({ rows, cols }) => {
    const { lines, tiles, setTiles, setLines, player1, player2, started, roomId, startGame } =
        useGame();
    const turn = true;
    const { on, off, emit } = useSocket();
    const [tempLine, setTempLine] = useState(null);
    const startDot = useRef(null);

    const handleDotMouseDown = (row, col) => {
        startDot.current = { row, col };
    };

    const checkIfTilePossible = useCallback(
        (p1, p2, p3, p4) => {
            const line1 = new Line(p1, p2);
            const line2 = new Line(p2, p3);
            const line3 = new Line(p3, p4);

            let check = [false, false, false];

            lines.forEach((line) => {
                if (line1.equals(line)) {
                    check[0] = true;
                } else if (line2.equals(line)) {
                    check[1] = true;
                } else if (line3.equals(line)) {
                    check[2] = true;
                }
            });

            console.log('check', check);

            if (check.includes(false)) {
                return false;
            }

            return true;
        },
        [lines]
    );

    const makePossiblePoints = useCallback(
        (line, color) => {
            const { start, end } = line;

            // lineIsHorizontal
            if (start.row === end.row) {
                let pu2, pu3, pd2, pd3, p4;
                const p1 = start.col < end.col ? start : end;
                p4 = new Point(p1.row, p1.col + 1);
                pd2 = new Point(p1.row + 1, p1.col);
                pd3 = new Point(p1.row + 1, p1.col + 1);
                pu2 = new Point(p1.row - 1, p1.col);
                pu3 = new Point(p1.row - 1, p1.col + 1);
                if (p1.row === 0) {
                    if (checkIfTilePossible(p1, pd2, pd3, p4)) {
                        setTiles([...tiles, { point: p1, color }]);
                    }
                } else if (p1.row === rows - 1) {
                    if (checkIfTilePossible(p1, pu2, pu3, p4)) {
                        setTiles([...tiles, { point: pu2, color }]);
                    }
                } else {
                    if (checkIfTilePossible(p1, pd2, pd3, p4)) {
                        setTiles([...tiles, { point: p1, color }]);
                    }
                    if (checkIfTilePossible(p1, pu2, pu3, p4)) {
                        setTiles([...tiles, { point: pu2, color }]);
                    }
                }
            } else if (start.col === end.col) {
                let pr2, pr3, pl2, pl3, p4;
                const p1 = start.row < end.row ? start : end;
                p4 = new Point(p1.row + 1, p1.col);
                pr2 = new Point(p1.row, p1.col + 1);
                pr3 = new Point(p1.row + 1, p1.col + 1);
                pl2 = new Point(p1.row, p1.col - 1);
                pl3 = new Point(p1.row + 1, p1.col - 1);
                if (p1.col === 0) {
                    if (checkIfTilePossible(p1, pr2, pr3, p4)) {
                        setTiles([...tiles, { point: p1, color }]);
                    }
                } else if (p1.col === cols - 1) {
                    if (checkIfTilePossible(p1, pl2, pl3, p4)) {
                        setTiles([...tiles, { point: pl2, color }]);
                    }
                } else {
                    if (checkIfTilePossible(p1, pr2, pr3, p4)) {
                        setTiles([...tiles, { point: p1, color }]);
                    }
                    if (checkIfTilePossible(p1, pl2, pl3, p4)) {
                        setTiles([...tiles, { point: pl2, color }]);
                    }
                }
            }
        },
        [checkIfTilePossible, cols, rows, setTiles, tiles]
    );

    const handleDotMouseUp = () => {
        if (!turn) return;
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
                setLines([...lines, newLine]);
                emit('move', { roomId, line: newLine.toString() });
                makePossiblePoints(newLine, 'blue');
                const audioEl = document.createElement('audio');
                audioEl.src = 'connect.wav';
                audioEl.play();
            }

            startDot.current = null;
            setTempLine(null);
        }
    };

    const handleMouseMove = (event) => {
        if (!turn) return;
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
            const { point, color } = tile;
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

    useEffect(() => {
        on('move', (data) => {
            const { line } = data;
            const newLine = Line.fromString(line);

            setLines([...lines, newLine]);
            makePossiblePoints(newLine, 'red');
        });
        return () => {
            off('move');
        };
    }, [lines, makePossiblePoints, off, on, player2?.color, setLines]);

    if (!started) {
        return (
            <div
                style={{
                    position: 'relative',
                }}
                className="dot-grid"
                onMouseMove={handleMouseMove}
                onMouseUp={handleDotMouseUp}>
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
                    <Button
                        style={{
                            width: 200,
                            height: 100,
                            fontSize: 50,
                            fontWeight: 'bold',
                        }}
                        onClick={startGame}>
                        Start
                    </Button>
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
                            style={{ cursor: turn ? 'pointer' : '' }}
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
    );
};

export default DotGrid;
