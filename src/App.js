import React from 'react';
import Lobby from './components/Lobby';
import { SocketProvider } from './contexts/SocketContext';

const App = () => {
    return (
        <div
            className="container-lg px-0"
            style={{
                borderLeft: '1px solid #ddd',
                borderRight: '1px solid #ddd',
            }}>
            <SocketProvider>
                <Lobby />
            </SocketProvider>
        </div>
    );
};

export default App;
