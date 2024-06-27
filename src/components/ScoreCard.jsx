import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function ScoreCard({ player1, player1Score, player2, player2Score, turn }) {
    const playerCard = (player, score, color) => {
        return (
            <div className="d-flex  flex-column align-items-center p-2">
                {!player ? (
                    <Spinner animation="border" />
                ) : (
                    <>
                        <div style={{ color: turn === player ? color : 'grey' }}>
                            <b>{player}</b>
                        </div>
                        <div style={{ color: turn === player ? 'black' : 'grey' }}>
                            Score: {score}
                        </div>
                    </>
                )}
            </div>
        );
    };
    return (
        <div className="bg-light p-3 w-100" style={{ border: '1px solid #ddd' }}>
            {true && (
                <div className="row mx-0">
                    <div className="col-12 col-md-4 p-0">
                        {playerCard(player1, player1Score, 'blue')}
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
                    <div className="col-12 col-md-4 p-0">
                        {playerCard(player2, player2Score, 'red')}
                    </div>
                </div>
            )}
        </div>
    );
}
