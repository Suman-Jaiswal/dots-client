import React, { useEffect, useState } from 'react';
import { Button, FormControl, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { randomizeUsername, updateUsername } from '../reducers/userReducer';
import { Avatar } from './Avatar';

export default function Header() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const roomJoined = useSelector((state) => state.room.roomJoined);
    const [username, setUsername] = useState(user.username);

    const handleChange = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
        dispatch(updateUsername({ username: e.target.value }));
    };

    useEffect(() => {
        setUsername(user.username);
    }, [user.username]);

    return (
        <Navbar
            variant="dark"
            expand="md"
            className="bg-light d-flex justify-content-between align-items-center py-2 px-4 m-0"
            style={{ borderBottom: '1px solid #333' }}>
            <Navbar.Brand className="fs-4">
                <b>Connect Dots</b>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="toggle" />
            <Navbar.Collapse id="toggle" className="justify-content-end">
                <div className="d-flex align-items-center gap-2 mt-2 mt-md-auto fs-5">
                    {roomJoined ? (
                        <>
                            <span>{username}</span>
                            <Avatar name={username} size={50} />
                        </>
                    ) : (
                        <>
                            <span>Name: </span>
                            <div style={{ width: 200 }}>
                                <FormControl
                                    type="text"
                                    value={username}
                                    onChange={handleChange}
                                    disabled={roomJoined}
                                />
                            </div>
                            <Button variant="success" onClick={() => dispatch(randomizeUsername())}>
                                Random
                            </Button>
                        </>
                    )}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}
