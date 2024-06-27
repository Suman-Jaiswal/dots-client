import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
    NumberDictionary,
    adjectives,
    animals,
    uniqueNamesGenerator,
} from 'unique-names-generator';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    const randomizeUsername = useCallback(() => {
        const username = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, NumberDictionary.generate({ min: 100, max: 999 })],
        });
        const user = { username };
        setUsername(username);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }, [setUser, setUsername]);

    useEffect(() => {
        const localUser = localStorage.getItem('user');
        if (localUser) {
            const parsedUser = JSON.parse(localUser);
            setUser(parsedUser);
            setUsername(parsedUser.username);
        } else {
            randomizeUsername();
        }
    }, [randomizeUsername, setUser, setUsername]);

    useEffect(() => {
        console.log('UserProvider mounted');
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                username,
                setUsername,
                error,
                setError,
                randomizeUsername,
            }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
