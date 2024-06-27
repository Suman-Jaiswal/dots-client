import { createSlice } from '@reduxjs/toolkit';
import {
    NumberDictionary,
    adjectives,
    animals,
    uniqueNamesGenerator,
} from 'unique-names-generator';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        username: '',
        error: null,
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.username = action.payload.username;
        },
        setUsername(state, action) {
            state.username = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        randomizeUsername(state, action) {
            const username = uniqueNamesGenerator({
                dictionaries: [
                    adjectives,
                    animals,
                    NumberDictionary.generate({ min: 100, max: 999 }),
                ],
            });
            const user = { username };
            localStorage.setItem('user', JSON.stringify(user));
            state.username = username;
            state.user = user;
        },
    },
});

export const { setUser, setUsername, setError, randomizeUsername } = userSlice.actions;
export default userSlice.reducer;
