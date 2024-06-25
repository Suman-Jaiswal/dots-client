import React from 'react';
import { Button, FormControl, Navbar } from 'react-bootstrap';
import useUser from '../hooks/useUser';

export default function Header() {
    const { username, randomizeUsername, handleChange } = useUser();
    return (
        <Navbar
            variant="light"
            className="bg-light d-flex justify-content-between align-items-center py-2 px-4"
            style={{ borderBottom: '1px solid #ddd' }}>
            <Navbar.Brand>Connect Dots</Navbar.Brand>
            <div className="d-flex align-items-center gap-2">
                <span>Welcome</span>
                <FormControl type="text" value={username} onChange={handleChange} />
                <Button variant="success" onClick={randomizeUsername}>
                    Random
                </Button>
            </div>
        </Navbar>
    );
}
