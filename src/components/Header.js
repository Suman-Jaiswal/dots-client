import React, { useEffect, useState } from 'react';
import { Button, FormControl, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { randomizeUsername, updateUsername } from '../reducers/userReducer';

export default function Header({ disabled = false }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
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
            variant="light"
            expand="md"
            className="bg-light d-flex justify-content-between align-items-center py-2 px-4 m-0"
            style={{ borderBottom: '1px solid #ddd' }}>
            <Navbar.Brand>Connect Dots</Navbar.Brand>
            <Navbar.Toggle aria-controls="toggle" />
            <Navbar.Collapse id="toggle" className="justify-content-end">
                <div className="d-flex align-items-center gap-2">
                    <span>Welcome</span>
                    <FormControl
                        type="text"
                        value={username}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    {!disabled && (
                        <Button variant="success" onClick={() => dispatch(randomizeUsername())}>
                            Random
                        </Button>
                    )}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}
