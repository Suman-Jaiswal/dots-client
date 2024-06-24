import React, { useEffect, useState } from 'react';
import { Button, FormControl, Navbar } from 'react-bootstrap';
import { NumberDictionary, adjectives, animals, uniqueNamesGenerator } from 'unique-names-generator';
import Lobby from './components/Lobby';

const App = () => {

  // const [user] = useAuthState(auth);

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState(null)
  const [roomId, setRoomId] = useState(null);

  const randomiseUsername = () => {
    const username = uniqueNamesGenerator({ dictionaries: [adjectives, animals, NumberDictionary.generate({ min: 100, max: 999 })] });
    const user = {
      username
    }
    setUsername(username)
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }


  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
      setUsername(JSON.parse(localUser).username)
    }
    else {
      randomiseUsername()
    }
  }, []);


  const handleChange = (e) => {
    e.preventDefault()
    setUsername(e.target.value)
    if (!e.target.value || e.target.value.length < 5) {
      setMessage('Username must be at least 5 characters long')
      return
    }
    setUser({
      username: e.target.value
    })
    localStorage.setItem('user', JSON.stringify(user))
    setMessage(null)
  }

  return (
    <div className='container' style={{
      borderLeft: '1px solid #ddd',
      borderRight: '1px solid #ddd',
    }}>
      {/* <div>
        <button onClick={logout} >Logout</button>
        <div>{user?.email}</div>
      </div> */}
      <Navbar variant='light' className='bg-light d-flex justify-content-between align-items-center py-2 px-4' style={{ borderBottom: '1px solid #ddd' }}>
        <Navbar.Brand >Connect Dots</Navbar.Brand>
        <div className='d-flex align-items-center gap-2'>
          <span>{message}</span>
          <span>Welcome</span>

          <FormControl type="text" disabled={roomId} value={username} onChange={handleChange} />
          {
            !roomId &&
            <Button variant='success' onClick={randomiseUsername} > Random</Button>
          }
        </div>
      </Navbar>
      {!message && <Lobby user={user} roomId={roomId} setRoomId={setRoomId} />}
    </div>
  );
};

export default App;
