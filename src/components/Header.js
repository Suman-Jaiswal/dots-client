import React from 'react';
import { Button, FormControl, Navbar } from 'react-bootstrap';
import useUser from '../hooks/useUser';

export default function Header({ disabled = false }) {
    const { username, randomizeUsername, handleChange } = useUser();
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
                        <Button variant="success" onClick={randomizeUsername}>
                            Random
                        </Button>
                    )}
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}
