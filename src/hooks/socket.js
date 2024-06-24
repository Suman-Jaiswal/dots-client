import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (url, user) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!url) return;
    try {
      const newSocket = io(url, {
        auth: {
          user: user,
          secret: process.env.REACT_APP_SECRET
        }
      });
      setSocket(newSocket);
      console.log('Socket connected', newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
    catch (error) {
      console.log(error);
    }
  }, [url, user]);

  return socket;
};

export default useSocket;