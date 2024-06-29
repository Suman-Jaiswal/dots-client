import React from 'react';
import Header from './components/Header';
import Lobby from './components/Lobby';
import useSocket from './hooks/useSocket';
import useUser from './hooks/useUser';
import { SocketProvider } from './socket/SocketProvider';

const App = () => {
    useUser();
    useSocket();

    return (
        <div
            className="container-lg px-0"
            style={{
                borderLeft: '1px solid #333',
                borderRight: '1px solid #333',
                height: '100vh',
                backgroundColor: 'rgba(250, 250, 250, 0.1)',
                backdropFilter: 'blur(1px)',
            }}>
            <SocketProvider>
                <Header />
                <Lobby />
            </SocketProvider>
        </div>
    );
};

export default App;
