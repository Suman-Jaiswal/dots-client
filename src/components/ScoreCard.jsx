import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setTurn } from '../reducers/gameReducer';
import { Avatar } from './Avatar';

export default function ScoreCard() {
    const dispatch = useDispatch();
    const { player1, player2 } = useSelector((state) => state.room);
    const playerScores = useSelector((state) => state.game.playerScores);
    const turn = useSelector((state) => state.game.turn);
    const winner = useSelector((state) => state.game.winner);

    const [player1Score, setPlayer1Score] = useState(null);
    const [player2Score, setPlayer2Score] = useState(null);

    useEffect(() => {
        setPlayer1Score(playerScores.filter((score) => score.username === player1)[0]?.score);
        setPlayer2Score(playerScores.filter((score) => score.username === player2)[0]?.score);
        if (winner) {
            dispatch(setTurn(null));
        }
    }, [dispatch, player1, player2, playerScores, winner]);

    const playerCard = (player, score, color) => {
        return (
            <div className="d-flex h-100  flex-column align-items-center justify-content-center p-2">
                {!player ? (
                    <Spinner animation="border" />
                ) : (
                    <>
                        <Avatar name={player} size={100} />
                        <div style={{ color: !turn ? 'white' : turn === player ? color : 'grey' }}>
                            <b>{player}</b>
                        </div>
                        <div style={{ color: !turn ? 'white' : turn === player ? color : 'grey' }}>
                            Score: {score}
                        </div>
                    </>
                )}
            </div>
        );
    };
    return (
        <div className="bg-light p-3 w-100" style={{ border: '1px solid #333' }}>
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
