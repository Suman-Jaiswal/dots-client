import React from 'react';
import Header from './components/Header';
import Lobby from './components/Lobby';
import { RoomProvider } from './contexts/RoomContext';
import { SocketProvider } from './contexts/SocketContext';

const App = () => {

  return (
    <div className='container-lg' style={{
      borderLeft: '1px solid #ddd',
      borderRight: '1px solid #ddd',
    }}>
      <Header />
      <SocketProvider>
        <RoomProvider>
          <Lobby />
        </RoomProvider>
      </SocketProvider>
    </div>
  );
};

export default App;
