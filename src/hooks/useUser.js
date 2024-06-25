import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const useUser = () => {
  const { user, username, error, setUser, setUsername, setError, randomizeUsername } = useContext(UserContext);

  const handleChange = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
    if (!e.target.value || e.target.value.length < 5) {
      setError('Username must be at least 5 characters long');
      return;
    }
    const updatedUser = { username: e.target.value };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setError(null);
  }
  return {
    user,
    username,
    error,
    handleChange,
    randomizeUsername
  };
}

export default useUser;
