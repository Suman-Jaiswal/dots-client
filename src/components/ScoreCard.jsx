import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function ScoreCard({ player1, player1Score, player2, player2Score, turn }) {
    return (
        <div className="bg-light p-3 w-100" style={{ border: '1px solid #ddd' }}>
            {true && (
                <div className="row mx-0">
                    <div
                        className="col-12 col-md-4 d-flex flex-column align-items-center rounded-pill p-2"
                        style={{
                            border: turn === player1 ? '3px solid blue' : '3px solid transparent',
                        }}>
                        {!player1 ? (
                            <Spinner animation="border" />
                        ) : (
                            <>
                                <div style={{ color: 'blue' }}>
                                    <b>{player1}</b>
                                </div>
                                <div>Score: {player1Score}</div>
                            </>
                        )}
                    </div>

                    <div className="col-12 d-flex flex-column flex-md-row justify-content-around col-md-4 align-items-center">
                        <div
                            className="fs-1 d-none d-md-block"
                            style={{ opacity: turn === player1 ? 1 : 0 }}>
                            ⬅
                        </div>
                        <div className="fs-5 my-2">
                            <b>V/S</b>
                        </div>
                        <div
                            className="fs-1 d-none d-md-block"
                            style={{ opacity: turn === player2 ? 1 : 0 }}>
                            ➡
                        </div>
                    </div>
                    <div
                        className="col-12 col-md-4 d-flex flex-column align-items-center justify-content-center rounded-pill p-2"
                        style={{
                            border: turn === player2 ? '3px solid red' : '3px solid transparent',
                        }}>
                        {!player2 ? (
                            <Spinner animation="border" />
                        ) : (
                            <>
                                <div style={{ color: 'red' }}>
                                    <b>{player2}</b>
                                </div>
                                <div>Score: {player2Score}</div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
